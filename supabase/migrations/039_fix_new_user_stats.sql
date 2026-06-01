-- Fix New User Stats: Set default values for rating and swaps_count to 0
-- This ensures new users start with 0 rating and 0 swaps

-- Set default values for future new users
ALTER TABLE public.profiles ALTER COLUMN rating SET DEFAULT 0.0;

ALTER TABLE public.profiles ALTER COLUMN swaps_count SET DEFAULT 0;

-- Clean existing data: Reset any users who shouldn't have ratings
UPDATE public.profiles SET rating = 0, swaps_count = 0 WHERE full_name = 'yousefkh123';

-- Also reset any other users with 0 swaps but non-zero rating (they shouldn't have ratings without swaps)
UPDATE public.profiles SET rating = 0 WHERE swaps_count = 0 AND rating > 0;
