-- ==============================================================================
-- COMMON Backend Migration: 04 - PostgreSQL RPC Functions (Atomic Business Logic)
-- ==============================================================================

-- ==============================================================================
-- 1. APPROVE BORROW REQUEST
-- Only the item owner can approve. Validates dates, atomically changes statuses.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.approve_borrow_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
    v_conflict_count INT;
BEGIN
    -- 1. Identify caller
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    -- 2. Lock and retrieve the borrowing request
    SELECT * INTO v_request
    FROM public.borrowing_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    -- 3. Lock and retrieve the associated item
    SELECT * INTO v_item
    FROM public.items
    WHERE id = v_request.item_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item associated with this request does not exist.';
    END IF;

    -- 4. Verify that the authenticated user owns the item
    IF v_item.owner_id <> v_user_id THEN
        RAISE EXCEPTION 'Forbidden: Only the owner of this item can approve borrowing requests.';
    END IF;

    -- 5. Verify the request is currently in pending status
    IF v_request.status <> 'pending' THEN
        RAISE EXCEPTION 'Cannot approve request: Current status is "%". Only "pending" requests can be approved.', v_request.status;
    END IF;

    -- 6. Check for overlapping approved requests for this item
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.borrowing_requests
    WHERE item_id = v_item.id
      AND id <> v_request.id
      AND status = 'approved'
      AND daterange(start_date, end_date, '[]') && daterange(v_request.start_date, v_request.end_date, '[]');

    IF v_conflict_count > 0 THEN
        RAISE EXCEPTION 'Conflicting booking: An approved borrowing request already exists overlapping % to %.',
            v_request.start_date, v_request.end_date;
    END IF;

    -- 7. Update the request status
    UPDATE public.borrowing_requests
    SET status = 'approved',
        approved_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    -- 8. Mark the item as borrowed
    UPDATE public.items
    SET status = 'borrowed',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_item.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Borrowing request approved successfully.',
        'request_id', v_request.id,
        'item_id', v_item.id,
        'status', 'approved',
        'item_status', 'borrowed',
        'approved_at', timezone('utc'::text, now())
    );
END;
$$;

COMMENT ON FUNCTION public.approve_borrow_request(UUID) IS 'Atomically approves a pending borrowing request. Callable by item owner.';

-- ==============================================================================
-- 2. REJECT BORROW REQUEST
-- Only the item owner can reject. Leaves item status untouched.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.reject_borrow_request(
    p_request_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
BEGIN
    -- 1. Identify caller
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    -- 2. Lock and retrieve the borrowing request
    SELECT * INTO v_request
    FROM public.borrowing_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    -- 3. Retrieve the associated item
    SELECT * INTO v_item
    FROM public.items
    WHERE id = v_request.item_id;

    -- 4. Verify that caller owns the item
    IF v_item.owner_id <> v_user_id THEN
        RAISE EXCEPTION 'Forbidden: Only the owner of this item can reject borrowing requests.';
    END IF;

    -- 5. Verify the request is pending
    IF v_request.status <> 'pending' THEN
        RAISE EXCEPTION 'Cannot reject request: Current status is "%". Only "pending" requests can be rejected.', v_request.status;
    END IF;

    -- 6. Update request status to rejected
    UPDATE public.borrowing_requests
    SET status = 'rejected',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Borrowing request rejected.',
        'request_id', v_request.id,
        'status', 'rejected',
        'reason', p_reason
    );
END;
$$;

COMMENT ON FUNCTION public.reject_borrow_request(UUID, TEXT) IS 'Atomically rejects a pending borrowing request. Callable by item owner.';

-- ==============================================================================
-- 3. RETURN BORROWED ITEM
-- Callable by either the item owner or the borrower. Atomically restores availability.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.return_borrowed_item(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
    v_other_active_borrows INT;
BEGIN
    -- 1. Identify caller
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    -- 2. Lock and retrieve request
    SELECT * INTO v_request
    FROM public.borrowing_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    -- 3. Lock and retrieve item
    SELECT * INTO v_item
    FROM public.items
    WHERE id = v_request.item_id
    FOR UPDATE;

    -- 4. Verify authorization: either the borrower or the item owner can register return
    IF v_user_id <> v_request.requester_id AND v_user_id <> v_item.owner_id THEN
        RAISE EXCEPTION 'Forbidden: Only the borrower or the item owner can confirm return of the item.';
    END IF;

    -- 5. Validate status is either approved or overdue
    IF v_request.status NOT IN ('approved', 'overdue') THEN
        RAISE EXCEPTION 'Cannot return item: Current request status is "%". Only "approved" or "overdue" items can be returned.', v_request.status;
    END IF;

    -- 6. Mark request as returned
    UPDATE public.borrowing_requests
    SET status = 'returned',
        returned_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    -- 7. Check if there are other overlapping/concurrent active borrowings for this item
    SELECT COUNT(*) INTO v_other_active_borrows
    FROM public.borrowing_requests
    WHERE item_id = v_item.id
      AND id <> v_request.id
      AND status IN ('approved', 'overdue');

    -- If no other active borrowings, restore item to 'available'
    IF v_other_active_borrows = 0 THEN
        UPDATE public.items
        SET status = 'available',
            updated_at = timezone('utc'::text, now())
        WHERE id = v_item.id;
    END IF;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Item returned successfully.',
        'request_id', v_request.id,
        'item_id', v_item.id,
        'status', 'returned',
        'item_status', CASE WHEN v_other_active_borrows = 0 THEN 'available' ELSE 'borrowed' END,
        'returned_at', timezone('utc'::text, now())
    );
END;
$$;

COMMENT ON FUNCTION public.return_borrowed_item(UUID) IS 'Completes the borrowing lifecycle, marking item returned and restoring availability.';

-- ==============================================================================
-- 4. CANCEL BORROW REQUEST
-- Requester can safely cancel their own request if it is still pending.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.cancel_borrow_request(p_request_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT * INTO v_request
    FROM public.borrowing_requests
    WHERE id = p_request_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    IF v_request.requester_id <> v_user_id THEN
        RAISE EXCEPTION 'Forbidden: Only the requester can cancel this borrowing request.';
    END IF;

    IF v_request.status <> 'pending' THEN
        RAISE EXCEPTION 'Cannot cancel request: Current status is "%". Only "pending" requests can be cancelled.', v_request.status;
    END IF;

    UPDATE public.borrowing_requests
    SET status = 'cancelled',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Borrowing request cancelled.',
        'request_id', v_request.id,
        'status', 'cancelled'
    );
END;
$$;

COMMENT ON FUNCTION public.cancel_borrow_request(UUID) IS 'Allows requester to cancel their own pending borrowing request.';

-- ==============================================================================
-- 5. OVERDUE SYNCHRONIZATION
-- Safe maintenance function to transition unreturned approved requests to overdue.
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.sync_overdue_borrowing_requests()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_updated_count INT;
BEGIN
    UPDATE public.borrowing_requests
    SET status = 'overdue',
        updated_at = timezone('utc'::text, now())
    WHERE status = 'approved'
      AND CURRENT_DATE > end_date
      AND returned_at IS NULL;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', TRUE,
        'overdue_count_updated', v_updated_count,
        'executed_at', timezone('utc'::text, now())
    );
END;
$$;

COMMENT ON FUNCTION public.sync_overdue_borrowing_requests() IS 'Sweeps and updates approved requests past their end_date to overdue.';
