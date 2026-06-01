-- Global Fake Ratings: Give random ratings and swap counts to everyone except Maryam and yousefkh123
-- This makes the platform look active while protecting specific users

UPDATE public.profiles 
SET rating = (floor(random() * (50-38+1) + 38) / 10), 
    swaps_count = floor(random() * 25) + 5 
WHERE full_name NOT IN ('Maryam', 'yousefkh123') 
  AND full_name IS NOT NULL;
