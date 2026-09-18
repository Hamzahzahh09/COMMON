-- ==============================================================================
-- COMMON Backend Migration: 06 - Dual Ownership, "I HAVE" Offers & Trust
-- ==============================================================================

-- 1. Add ownership_type to items table (Personal vs Community Resource)
ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS ownership_type TEXT NOT NULL DEFAULT 'personal';

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_item_ownership_type'
    ) THEN
        ALTER TABLE public.items
        ADD CONSTRAINT chk_item_ownership_type CHECK (ownership_type IN ('personal', 'community'));
    END IF;
END $$;

COMMENT ON COLUMN public.items.ownership_type IS 'Personal resource (shared by resident) or Community resource (owned collectively by community).';

-- 2. Add pickup instructions and return condition check to borrowing_requests
ALTER TABLE public.borrowing_requests
ADD COLUMN IF NOT EXISTS pickup_instructions TEXT,
ADD COLUMN IF NOT EXISTS return_condition TEXT,
ADD COLUMN IF NOT EXISTS return_notes TEXT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_return_condition'
    ) THEN
        ALTER TABLE public.borrowing_requests
        ADD CONSTRAINT chk_return_condition CHECK (
            return_condition IS NULL OR return_condition IN ('pristine', 'good', 'fair', 'needs_maintenance')
        );
    END IF;
END $$;

COMMENT ON COLUMN public.borrowing_requests.return_condition IS 'Condition confirmed upon return: pristine, good, fair, or needs_maintenance.';

-- 3. Create community_need_offers table ("I HAVE" response mechanism)
CREATE TABLE IF NOT EXISTS public.community_need_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    need_id UUID NOT NULL REFERENCES public.community_needs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_offer_status CHECK (status IN ('pending', 'accepted', 'declined'))
);

CREATE INDEX IF NOT EXISTS idx_need_offers_need_id ON public.community_need_offers(need_id);
CREATE INDEX IF NOT EXISTS idx_need_offers_user_id ON public.community_need_offers(user_id);

COMMENT ON TABLE public.community_need_offers IS 'Offers made by neighbors ("I HAVE this") in response to a posted community need.';

-- 4. Create borrowing_messages table (Borrower-Owner communication & pickup coordination)
CREATE TABLE IF NOT EXISTS public.borrowing_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.borrowing_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_borrowing_messages_request ON public.borrowing_messages(request_id);

COMMENT ON TABLE public.borrowing_messages IS 'Direct coordination messages between borrower and owner for a borrowing request.';

-- 5. Create community_discussions table (Discussions & Papan Warga)
CREATE TABLE IF NOT EXISTS public.community_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_discussion_category CHECK (category IN ('general', 'resource_qa', 'announcement'))
);

CREATE INDEX IF NOT EXISTS idx_discussions_community ON public.community_discussions(community_id);

COMMENT ON TABLE public.community_discussions IS 'Community bulletin board and shared resource discussions.';

-- 6. Enable RLS on newly created tables
ALTER TABLE public.community_need_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowing_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_discussions ENABLE ROW LEVEL SECURITY;

-- Policies for community_need_offers
CREATE POLICY "Need offers viewable by community members"
ON public.community_need_offers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.community_needs n
        WHERE n.id = community_need_offers.need_id
          AND public.is_community_member(n.community_id, auth.uid())
    )
);

CREATE POLICY "Community members can create offers"
ON public.community_need_offers FOR INSERT
WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
        SELECT 1 FROM public.community_needs n
        WHERE n.id = need_id
          AND public.is_community_member(n.community_id, auth.uid())
    )
);

CREATE POLICY "Offer creator or need creator can update offer"
ON public.community_need_offers FOR UPDATE
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM public.community_needs n
        WHERE n.id = community_need_offers.need_id
          AND n.user_id = auth.uid()
    )
);

-- Policies for borrowing_messages
CREATE POLICY "Messages viewable by borrower or item owner"
ON public.borrowing_messages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.borrowing_requests r
        JOIN public.items i ON i.id = r.item_id
        WHERE r.id = borrowing_messages.request_id
          AND (r.requester_id = auth.uid() OR i.owner_id = auth.uid())
    )
);

CREATE POLICY "Borrower or item owner can send messages"
ON public.borrowing_messages FOR INSERT
WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
        SELECT 1 FROM public.borrowing_requests r
        JOIN public.items i ON i.id = r.item_id
        WHERE r.id = request_id
          AND (r.requester_id = auth.uid() OR i.owner_id = auth.uid())
    )
);

-- Policies for community_discussions
CREATE POLICY "Discussions viewable by community members"
ON public.community_discussions FOR SELECT
USING (public.is_community_member(community_id, auth.uid()));

CREATE POLICY "Community members can post discussions"
ON public.community_discussions FOR INSERT
WITH CHECK (
    auth.uid() = author_id AND
    public.is_community_member(community_id, auth.uid())
);

CREATE POLICY "Discussion author can update or delete"
ON public.community_discussions FOR ALL
USING (auth.uid() = author_id);

-- 7. Update approve_borrow_request RPC to support Community-Owned Resources (Admin approval)
CREATE OR REPLACE FUNCTION public.approve_borrow_request(
    p_request_id UUID,
    p_pickup_instructions TEXT DEFAULT NULL
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
    v_conflict_count INT;
    v_is_admin BOOLEAN;
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

    -- 4. Verify authorization:
    -- If personal: Only the item owner can approve.
    -- If community: The item owner OR a community admin can approve.
    IF v_item.ownership_type = 'community' THEN
        v_is_admin := public.is_community_admin(v_item.community_id, v_user_id);
        IF v_item.owner_id <> v_user_id AND NOT v_is_admin THEN
            RAISE EXCEPTION 'Forbidden: Only the resource custodian or a community admin can approve requests for community-owned items.';
        END IF;
    ELSE
        IF v_item.owner_id <> v_user_id THEN
            RAISE EXCEPTION 'Forbidden: Only the owner of this personal item can approve borrowing requests.';
        END IF;
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
        pickup_instructions = COALESCE(p_pickup_instructions, pickup_instructions),
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
        'approved_at', timezone('utc'::text, now()),
        'pickup_instructions', p_pickup_instructions
    );
END;
$$;
