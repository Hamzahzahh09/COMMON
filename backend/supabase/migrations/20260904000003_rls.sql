-- ==============================================================================
-- COMMON Backend Migration: 03 - Row Level Security (RLS) & Helper Functions
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- Using SECURITY DEFINER and STABLE avoids infinite recursion in RLS policies
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.is_community_member(
    p_community_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.community_members
        WHERE community_id = p_community_id
          AND user_id = p_user_id
    );
$$;

COMMENT ON FUNCTION public.is_community_member(UUID, UUID) IS 'Checks if a user is a member of the given community.';

CREATE OR REPLACE FUNCTION public.is_community_admin(
    p_community_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.community_members
        WHERE community_id = p_community_id
          AND user_id = p_user_id
          AND role = 'admin'
    );
$$;

COMMENT ON FUNCTION public.is_community_admin(UUID, UUID) IS 'Checks if a user has admin role in the given community.';

CREATE OR REPLACE FUNCTION public.shares_community_with(
    p_target_user_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.community_members m1
        JOIN public.community_members m2 ON m1.community_id = m2.community_id
        WHERE m1.user_id = p_user_id
          AND m2.user_id = p_target_user_id
    );
$$;

COMMENT ON FUNCTION public.shares_community_with(UUID, UUID) IS 'Checks if two users belong to at least one common community.';

-- ==============================================================================
-- 2. ENABLE RLS ON ALL TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_needs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. PROFILES POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Profiles are visible to self and community co-members" ON public.profiles;
CREATE POLICY "Profiles are visible to self and community co-members"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (
        id = auth.uid() OR public.shares_community_with(id, auth.uid())
    );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid());

-- ==============================================================================
-- 4. COMMUNITIES POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Community members can view their communities" ON public.communities;
CREATE POLICY "Community members can view their communities"
    ON public.communities
    FOR SELECT
    TO authenticated
    USING (public.is_community_member(id, auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
CREATE POLICY "Authenticated users can create communities"
    ON public.communities
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = auth.uid()));

DROP POLICY IF EXISTS "Community admins can update their community" ON public.communities;
CREATE POLICY "Community admins can update their community"
    ON public.communities
    FOR UPDATE
    TO authenticated
    USING (public.is_community_admin(id, auth.uid()))
    WITH CHECK (public.is_community_admin(id, auth.uid()));

-- ==============================================================================
-- 5. COMMUNITY MEMBERS POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Members can view other members of their community" ON public.community_members;
CREATE POLICY "Members can view other members of their community"
    ON public.community_members
    FOR SELECT
    TO authenticated
    USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Admins can manage community members" ON public.community_members;
CREATE POLICY "Admins can manage community members"
    ON public.community_members
    FOR ALL
    TO authenticated
    USING (public.is_community_admin(community_id, auth.uid()))
    WITH CHECK (public.is_community_admin(community_id, auth.uid()));

DROP POLICY IF EXISTS "Users can join a community if permitted or self-leave" ON public.community_members;
CREATE POLICY "Users can join a community if permitted or self-leave"
    ON public.community_members
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ==============================================================================
-- 6. ITEMS POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Members can view items in their communities" ON public.items;
CREATE POLICY "Members can view items in their communities"
    ON public.items
    FOR SELECT
    TO authenticated
    USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Members can insert items in their communities" ON public.items;
CREATE POLICY "Members can insert items in their communities"
    ON public.items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_community_member(community_id, auth.uid())
        AND owner_id = auth.uid()
    );

DROP POLICY IF EXISTS "Owners can update their own items" ON public.items;
CREATE POLICY "Owners can update their own items"
    ON public.items
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid())
    WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can delete their own items" ON public.items;
CREATE POLICY "Owners can delete their own items"
    ON public.items
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

-- ==============================================================================
-- 7. BORROWING REQUESTS POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Requesters and item owners can view requests" ON public.borrowing_requests;
CREATE POLICY "Requesters and item owners can view requests"
    ON public.borrowing_requests
    FOR SELECT
    TO authenticated
    USING (
        requester_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.items
            WHERE items.id = borrowing_requests.item_id
              AND items.owner_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Community members can create borrowing requests" ON public.borrowing_requests;
CREATE POLICY "Community members can create borrowing requests"
    ON public.borrowing_requests
    FOR INSERT
    TO authenticated
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
CREATE POLICY "Requesters can cancel their own pending requests"
    ON public.borrowing_requests
    FOR UPDATE
    TO authenticated
    USING (
        requester_id = auth.uid()
        AND status = 'pending'
    )
    WITH CHECK (
        requester_id = auth.uid()
        AND status IN ('pending', 'cancelled')
    );

-- ==============================================================================
-- 8. COMMUNITY NEEDS POLICIES
-- ==============================================================================
DROP POLICY IF EXISTS "Members can view needs in their communities" ON public.community_needs;
CREATE POLICY "Members can view needs in their communities"
    ON public.community_needs
    FOR SELECT
    TO authenticated
    USING (public.is_community_member(community_id, auth.uid()));

DROP POLICY IF EXISTS "Members can post needs in their communities" ON public.community_needs;
CREATE POLICY "Members can post needs in their communities"
    ON public.community_needs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        public.is_community_member(community_id, auth.uid())
        AND user_id = auth.uid()
    );

DROP POLICY IF EXISTS "Creators can update their own needs" ON public.community_needs;
CREATE POLICY "Creators can update their own needs"
    ON public.community_needs
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Creators can delete their own needs" ON public.community_needs;
CREATE POLICY "Creators can delete their own needs"
    ON public.community_needs
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());
