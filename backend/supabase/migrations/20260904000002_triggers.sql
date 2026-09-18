-- ==============================================================================
-- COMMON Backend Migration: 02 - Database Triggers & Automation
-- ==============================================================================

-- ==============================================================================
-- 1. UPDATED_AT TIMESTAMP SYNCHRONIZATION
-- ==============================================================================
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

COMMENT ON FUNCTION public.handle_updated_at() IS 'Trigger function to automatically keep updated_at in sync with current timestamp.';

-- Attach updated_at triggers to all core tables
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_communities_updated_at ON public.communities;
CREATE TRIGGER trg_communities_updated_at
    BEFORE UPDATE ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_items_updated_at ON public.items;
CREATE TRIGGER trg_items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_borrowing_requests_updated_at ON public.borrowing_requests;
CREATE TRIGGER trg_borrowing_requests_updated_at
    BEFORE UPDATE ON public.borrowing_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_community_needs_updated_at ON public.community_needs;
CREATE TRIGGER trg_community_needs_updated_at
    BEFORE UPDATE ON public.community_needs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 2. AUTOMATIC PROFILE CREATION ON SIGNUP
-- ==============================================================================
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
    -- Derive user's display name from metadata or fallback to email prefix
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
    VALUES (
        NEW.id,
        v_full_name,
        v_avatar_url,
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        updated_at = timezone('utc'::text, now());

    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function to automatically create a public profile when a user registers in auth.users.';

-- Attach to auth.users AFTER INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. AUTO-ADD COMMUNITY CREATOR AS ADMIN
-- ==============================================================================
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

COMMENT ON FUNCTION public.handle_new_community_creator() IS 'Automatically gives admin role in community_members to the creator of a community.';

DROP TRIGGER IF EXISTS trg_community_creator_admin ON public.communities;
CREATE TRIGGER trg_community_creator_admin
    AFTER INSERT ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_community_creator();

-- ==============================================================================
-- 4. VALIDATE BORROWING REQUEST CREATION
-- ==============================================================================
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
    -- 1. Fetch item details
    SELECT owner_id, community_id, status
    INTO v_item_owner_id, v_item_community_id, v_item_status
    FROM public.items
    WHERE id = NEW.item_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item not found with id %', NEW.item_id;
    END IF;

    -- 2. Disallow owner from requesting their own item
    IF v_item_owner_id = NEW.requester_id THEN
        RAISE EXCEPTION 'Users cannot request to borrow their own items.';
    END IF;

    -- 3. Ensure item is not permanently unavailable
    IF v_item_status = 'unavailable' THEN
        RAISE EXCEPTION 'This item is currently marked as unavailable for borrowing.';
    END IF;

    -- 4. Verify requester is a member of the item community
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

COMMENT ON FUNCTION public.validate_new_borrowing_request() IS 'Validates business rules before creating a borrowing request.';

DROP TRIGGER IF EXISTS trg_validate_new_borrowing_request ON public.borrowing_requests;
CREATE TRIGGER trg_validate_new_borrowing_request
    BEFORE INSERT ON public.borrowing_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_new_borrowing_request();
