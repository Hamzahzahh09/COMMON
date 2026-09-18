-- ==============================================================================
-- COMMON Backend Migration: 001_initial_schema.sql
-- Complete PostgreSQL schema, triggers, RLS, RPC functions, and indexes
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ==============================================================================
-- 2. CORE TABLES
-- ==============================================================================

-- PROFILES (connected 1:1 to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- COMMUNITIES (neighborhood shared inventories)
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    location TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- COMMUNITY MEMBERS (many-to-many users <-> communities)
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_member_role CHECK (role IN ('member', 'admin')),
    CONSTRAINT uq_community_member UNIQUE (community_id, user_id)
);

-- ITEMS (shared physical resources)
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    condition TEXT,
    location_hint TEXT,
    borrowing_rules TEXT,
    status TEXT NOT NULL DEFAULT 'available',
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_item_status CHECK (status IN ('available', 'borrowed', 'unavailable'))
);

-- BORROWING REQUESTS (core borrowing transactions)
CREATE TABLE IF NOT EXISTS public.borrowing_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    returned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_request_dates CHECK (start_date <= end_date),
    CONSTRAINT chk_request_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'returned', 'overdue')),
    -- PostgreSQL engine-level exclusion constraint: prevents overlapping approved requests for the same item
    CONSTRAINT uq_no_overlapping_approved_bookings
        EXCLUDE USING gist (
            item_id WITH =,
            daterange(start_date, end_date, '[]') WITH &&
        ) WHERE (status = 'approved')
);

-- COMMUNITY NEEDS (wishlist board)
CREATE TABLE IF NOT EXISTS public.community_needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    needed_from DATE,
    needed_until DATE,
    status TEXT NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_need_dates CHECK (needed_from IS NULL OR needed_until IS NULL OR needed_from <= needed_until),
    CONSTRAINT chk_need_status CHECK (status IN ('open', 'fulfilled', 'closed'))
);

-- ==============================================================================
-- 3. INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_items_community_id ON public.items(community_id);
CREATE INDEX IF NOT EXISTS idx_items_owner_id ON public.items(owner_id);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_borrowing_requests_item_id ON public.borrowing_requests(item_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_requests_requester_id ON public.borrowing_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_borrowing_requests_status ON public.borrowing_requests(status);
CREATE INDEX IF NOT EXISTS idx_borrowing_requests_dates ON public.borrowing_requests(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_community_needs_community_id ON public.community_needs(community_id);
CREATE INDEX IF NOT EXISTS idx_community_needs_status ON public.community_needs(status);

-- ==============================================================================
-- 4. DATABASE TRIGGERS & AUTOMATION
-- ==============================================================================

-- Timestamp sync
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_communities_updated_at ON public.communities;
CREATE TRIGGER trg_communities_updated_at BEFORE UPDATE ON public.communities FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_items_updated_at ON public.items;
CREATE TRIGGER trg_items_updated_at BEFORE UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_borrowing_requests_updated_at ON public.borrowing_requests;
CREATE TRIGGER trg_borrowing_requests_updated_at BEFORE UPDATE ON public.borrowing_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_community_needs_updated_at ON public.community_needs;
CREATE TRIGGER trg_community_needs_updated_at BEFORE UPDATE ON public.community_needs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-profile creation on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_full_name TEXT;
    v_avatar_url TEXT;
BEGIN
    v_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    v_avatar_url := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
    );

    INSERT INTO public.profiles (id, full_name, avatar_url, created_at, updated_at)
    VALUES (NEW.id, v_full_name, v_avatar_url, timezone('utc'::text, now()), timezone('utc'::text, now()))
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-admin for community creator
CREATE OR REPLACE FUNCTION public.handle_new_community_creator()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.created_by IS NOT NULL THEN
        INSERT INTO public.community_members (community_id, user_id, role)
        VALUES (NEW.id, NEW.created_by, 'admin')
        ON CONFLICT (community_id, user_id) DO UPDATE SET role = 'admin';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_community_creator_admin ON public.communities;
CREATE TRIGGER trg_community_creator_admin AFTER INSERT ON public.communities FOR EACH ROW EXECUTE FUNCTION public.handle_new_community_creator();

-- Validate borrowing requests before insert
CREATE OR REPLACE FUNCTION public.validate_new_borrowing_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_item_owner_id UUID;
    v_item_community_id UUID;
    v_item_status TEXT;
    v_is_member BOOLEAN;
BEGIN
    SELECT owner_id, community_id, status
    INTO v_item_owner_id, v_item_community_id, v_item_status
    FROM public.items
    WHERE id = NEW.item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item not found with id %', NEW.item_id;
    END IF;

    IF v_item_owner_id = NEW.requester_id THEN
        RAISE EXCEPTION 'Users cannot request to borrow their own items.';
    END IF;

    IF v_item_status = 'unavailable' THEN
        RAISE EXCEPTION 'This item is currently marked as unavailable for borrowing.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.community_members
        WHERE community_id = v_item_community_id AND user_id = NEW.requester_id
    ) INTO v_is_member;

    IF NOT v_is_member THEN
        RAISE EXCEPTION 'Requester must be a member of the community that shares this item.';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_new_borrowing_request ON public.borrowing_requests;
CREATE TRIGGER trg_validate_new_borrowing_request BEFORE INSERT ON public.borrowing_requests FOR EACH ROW EXECUTE FUNCTION public.validate_new_borrowing_request();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY & HELPER FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_community_member(p_community_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = p_community_id AND user_id = p_user_id);
$$;

CREATE OR REPLACE FUNCTION public.is_community_admin(p_community_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (SELECT 1 FROM public.community_members WHERE community_id = p_community_id AND user_id = p_user_id AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.shares_community_with(p_target_user_id UUID, p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.community_members m1
        JOIN public.community_members m2 ON m1.community_id = m2.community_id
        WHERE m1.user_id = p_user_id AND m2.user_id = p_target_user_id
    );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_needs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Profiles are visible to self and community co-members" ON public.profiles;
CREATE POLICY "Profiles are visible to self and community co-members" ON public.profiles FOR SELECT TO authenticated
USING (id = auth.uid() OR public.shares_community_with(id, auth.uid()));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (id = auth.uid());

-- Communities policies
DROP POLICY IF EXISTS "Community members can view their communities" ON public.communities;
CREATE POLICY "Community members can view their communities" ON public.communities FOR SELECT TO authenticated
USING (public.is_community_member(id, auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
CREATE POLICY "Authenticated users can create communities" ON public.communities FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));

DROP POLICY IF EXISTS "Community admins can update their community" ON public.communities;
CREATE POLICY "Community admins can update their community" ON public.communities FOR UPDATE TO authenticated
USING (public.is_community_admin(id, auth.uid())) WITH CHECK (public.is_community_admin(id, auth.uid()));

-- Community members policies
DROP POLICY IF EXISTS "Members can view other members of their community" ON public.community_members;
CREATE POLICY "Members can view other members of their community" ON public.community_members FOR SELECT TO authenticated
USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage community members" ON public.community_members;
CREATE POLICY "Admins can manage community members" ON public.community_members FOR ALL TO authenticated
USING (public.is_community_admin(community_id, auth.uid())) WITH CHECK (public.is_community_admin(community_id, auth.uid()));

DROP POLICY IF EXISTS "Users can join a community if permitted or self-leave" ON public.community_members;
CREATE POLICY "Users can join a community if permitted or self-leave" ON public.community_members FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- Items policies
DROP POLICY IF EXISTS "Members can view items in their communities" ON public.items;
CREATE POLICY "Members can view items in their communities" ON public.items FOR SELECT TO authenticated
USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Members can insert items in their communities" ON public.items;
CREATE POLICY "Members can insert items in their communities" ON public.items FOR INSERT TO authenticated
WITH CHECK (public.is_community_member(community_id, auth.uid()) AND owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can update their own items" ON public.items;
CREATE POLICY "Owners can update their own items" ON public.items FOR UPDATE TO authenticated
USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their own items" ON public.items;
CREATE POLICY "Owners can delete their own items" ON public.items FOR DELETE TO authenticated
USING (owner_id = auth.uid());

-- Borrowing requests policies
DROP POLICY IF EXISTS "Requesters and item owners can view requests" ON public.borrowing_requests;
CREATE POLICY "Requesters and item owners can view requests" ON public.borrowing_requests FOR SELECT TO authenticated
USING (requester_id = auth.uid() OR EXISTS (SELECT 1 FROM public.items WHERE items.id = borrowing_requests.item_id AND items.owner_id = auth.uid()));

DROP POLICY IF EXISTS "Community members can create borrowing requests" ON public.borrowing_requests;
CREATE POLICY "Community members can create borrowing requests" ON public.borrowing_requests FOR INSERT TO authenticated
WITH CHECK (
    requester_id = auth.uid()
    AND EXISTS (
        SELECT 1 FROM public.items
        WHERE items.id = item_id
          AND public.is_community_member(items.community_id, auth.uid())
          AND items.owner_id <> auth.uid()
    )
);

DROP POLICY IF EXISTS "Requesters can cancel their own pending requests" ON public.borrowing_requests;
CREATE POLICY "Requesters can cancel their own pending requests" ON public.borrowing_requests FOR UPDATE TO authenticated
USING (requester_id = auth.uid() AND status = 'pending')
WITH CHECK (requester_id = auth.uid() AND status IN ('pending', 'cancelled'));

-- Community needs policies
DROP POLICY IF EXISTS "Members can view needs in their communities" ON public.community_needs;
CREATE POLICY "Members can view needs in their communities" ON public.community_needs FOR SELECT TO authenticated
USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Members can post needs in their communities" ON public.community_needs;
CREATE POLICY "Members can post needs in their communities" ON public.community_needs FOR INSERT TO authenticated
WITH CHECK (public.is_community_member(community_id, auth.uid()) AND user_id = auth.uid());

DROP POLICY IF EXISTS "Creators can update their own needs" ON public.community_needs;
CREATE POLICY "Creators can update their own needs" ON public.community_needs FOR UPDATE TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Creators can delete their own needs" ON public.community_needs;
CREATE POLICY "Creators can delete their own needs" ON public.community_needs FOR DELETE TO authenticated
USING (user_id = auth.uid());

-- ==============================================================================
-- 6. POSTGRESQL RPC FUNCTIONS
-- ==============================================================================

-- 1. APPROVE BORROW REQUEST
CREATE OR REPLACE FUNCTION public.approve_borrow_request(p_request_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
    v_conflict_count INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT * INTO v_request FROM public.borrowing_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_request.item_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item associated with this request does not exist.';
    END IF;

    IF v_item.owner_id <> v_user_id THEN
        RAISE EXCEPTION 'Forbidden: Only the owner of this item can approve borrowing requests.';
    END IF;

    IF v_request.status <> 'pending' THEN
        RAISE EXCEPTION 'Cannot approve request: Current status is "%". Only "pending" requests can be approved.', v_request.status;
    END IF;

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

    UPDATE public.borrowing_requests
    SET status = 'approved', approved_at = timezone('utc'::text, now()), updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    UPDATE public.items
    SET status = 'borrowed', updated_at = timezone('utc'::text, now())
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

-- 2. REJECT BORROW REQUEST
CREATE OR REPLACE FUNCTION public.reject_borrow_request(p_request_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT * INTO v_request FROM public.borrowing_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_request.item_id;

    IF v_item.owner_id <> v_user_id THEN
        RAISE EXCEPTION 'Forbidden: Only the owner of this item can reject borrowing requests.';
    END IF;

    IF v_request.status <> 'pending' THEN
        RAISE EXCEPTION 'Cannot reject request: Current status is "%". Only "pending" requests can be rejected.', v_request.status;
    END IF;

    UPDATE public.borrowing_requests
    SET status = 'rejected', updated_at = timezone('utc'::text, now())
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

-- 3. RETURN BORROWED ITEM
CREATE OR REPLACE FUNCTION public.return_borrowed_item(p_request_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
    v_item RECORD;
    v_other_active_borrows INT;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT * INTO v_request FROM public.borrowing_requests WHERE id = p_request_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Borrowing request not found with id %', p_request_id;
    END IF;

    SELECT * INTO v_item FROM public.items WHERE id = v_request.item_id FOR UPDATE;

    IF v_user_id <> v_request.requester_id AND v_user_id <> v_item.owner_id THEN
        RAISE EXCEPTION 'Forbidden: Only the borrower or the item owner can confirm return of the item.';
    END IF;

    IF v_request.status NOT IN ('approved', 'overdue') THEN
        RAISE EXCEPTION 'Cannot return item: Current request status is "%". Only "approved" or "overdue" items can be returned.', v_request.status;
    END IF;

    UPDATE public.borrowing_requests
    SET status = 'returned', returned_at = timezone('utc'::text, now()), updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    SELECT COUNT(*) INTO v_other_active_borrows
    FROM public.borrowing_requests
    WHERE item_id = v_item.id AND id <> v_request.id AND status IN ('approved', 'overdue');

    IF v_other_active_borrows = 0 THEN
        UPDATE public.items
        SET status = 'available', updated_at = timezone('utc'::text, now())
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

-- 4. CANCEL BORROW REQUEST
CREATE OR REPLACE FUNCTION public.cancel_borrow_request(p_request_id UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_user_id UUID;
    v_request RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: Authentication required.';
    END IF;

    SELECT * INTO v_request FROM public.borrowing_requests WHERE id = p_request_id FOR UPDATE;
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
    SET status = 'cancelled', updated_at = timezone('utc'::text, now())
    WHERE id = v_request.id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'message', 'Borrowing request cancelled.',
        'request_id', v_request.id,
        'status', 'cancelled'
    );
END;
$$;

-- 5. OVERDUE SYNCHRONIZATION
CREATE OR REPLACE FUNCTION public.sync_overdue_borrowing_requests()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_updated_count INT;
BEGIN
    UPDATE public.borrowing_requests
    SET status = 'overdue', updated_at = timezone('utc'::text, now())
    WHERE status = 'approved' AND CURRENT_DATE > end_date AND returned_at IS NULL;

    GET DIAGNOSTICS v_updated_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', TRUE,
        'overdue_count_updated', v_updated_count,
        'executed_at', timezone('utc'::text, now())
    );
END;
$$;
