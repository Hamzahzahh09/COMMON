-- ==============================================================================
-- COMMON Backend Migration: 01 - Schema & Core Constraints
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ==============================================================================
-- 1. PROFILES (connected 1:1 to auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE public.profiles IS 'User profiles mirroring authenticated Supabase users.';

-- ==============================================================================
-- 2. COMMUNITIES (neighborhood shared inventories)
-- ==============================================================================
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

COMMENT ON TABLE public.communities IS 'Isolated neighborhood or group sharing inventories.';

-- ==============================================================================
-- 3. COMMUNITY MEMBERS (many-to-many users <-> communities)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT chk_member_role CHECK (role IN ('member', 'admin')),
    CONSTRAINT uq_community_member UNIQUE (community_id, user_id)
);

COMMENT ON TABLE public.community_members IS 'Membership and roles of users within specific communities.';

-- ==============================================================================
-- 4. ITEMS (shared physical resources)
-- ==============================================================================
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

COMMENT ON TABLE public.items IS 'Physical items made available for community borrowing.';
COMMENT ON COLUMN public.items.status IS 'Physical availability: available, borrowed, or unavailable. Never "requested".';

-- ==============================================================================
-- 5. BORROWING REQUESTS (core borrowing transactions)
-- ==============================================================================
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

COMMENT ON TABLE public.borrowing_requests IS 'Borrowing request lifecycle: pending -> approved/rejected -> returned/overdue.';

-- ==============================================================================
-- 6. COMMUNITY NEEDS (wishlist / "need an item" board)
-- ==============================================================================
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

COMMENT ON TABLE public.community_needs IS 'Community-wide requests for items not yet shared.';

-- ==============================================================================
-- INDEXES FOR HIGH QUERY PERFORMANCE
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
