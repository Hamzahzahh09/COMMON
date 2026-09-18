-- ==============================================================================
-- COMMON Backend Migration: 05 - Supabase Storage Configuration & Policies
-- ==============================================================================

-- 1. Create the item-images bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'item-images',
    'item-images',
    false, -- Private bucket: access regulated via community membership or signed URLs
    5242880, -- 5MB limit per image
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. STORAGE ROW LEVEL SECURITY POLICIES
-- Folder convention: {uploader_user_id}/{filename}
-- ==============================================================================

-- SELECT: Allow viewing if the viewer is the owner OR shares a community with the owner
DROP POLICY IF EXISTS "Community members can view item images" ON storage.objects;
CREATE POLICY "Community members can view item images"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'item-images'
        AND (
            -- Either the viewer is the uploader
            (storage.foldername(name))[1] = auth.uid()::text
            -- Or the viewer belongs to a shared community with the uploader
            OR (
                (storage.foldername(name))[1] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
                AND public.shares_community_with(((storage.foldername(name))[1])::uuid, auth.uid())
            )
        )
    );

-- INSERT: Authenticated users can upload to their own user directory
DROP POLICY IF EXISTS "Users can upload item images into their own folder" ON storage.objects;
CREATE POLICY "Users can upload item images into their own folder"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'item-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- UPDATE: Users can update only their own uploaded images
DROP POLICY IF EXISTS "Users can update their own item images" ON storage.objects;
CREATE POLICY "Users can update their own item images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'item-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'item-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- DELETE: Users can delete only their own uploaded images
DROP POLICY IF EXISTS "Users can delete their own item images" ON storage.objects;
CREATE POLICY "Users can delete their own item images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'item-images'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
