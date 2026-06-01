-- Add rating and swaps_count columns to profiles table
-- These columns are needed for the Explore page functionality

ALTER TABLE public.profiles 
ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN swaps_count INTEGER DEFAULT 0;

-- Add comments for new columns
COMMENT ON COLUMN public.profiles.rating IS 'User rating from 0.0 to 5.0';
COMMENT ON COLUMN public.profiles.swaps_count IS 'Total number of skill swaps completed by user';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_rating_idx ON public.profiles(rating);
CREATE INDEX IF NOT EXISTS profiles_swaps_count_idx ON public.profiles(swaps_count);
