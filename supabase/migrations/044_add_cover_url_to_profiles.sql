-- Add cover_url column to profiles table for profile banner/cover images
-- Run this in your Supabase SQL editor.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Cover images are stored in the existing `avatars` bucket under the `covers/` prefix,
-- so no new bucket or storage policy is required. Existing avatar policies already cover it.
