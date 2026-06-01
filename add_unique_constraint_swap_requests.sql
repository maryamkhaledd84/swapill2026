-- Add unique constraint to prevent duplicate swap requests
-- This ensures that the same sender cannot send multiple requests to the same receiver

-- First, remove any existing duplicate requests (keep the most recent one)
WITH ranked_requests AS (
  SELECT 
    id,
    sender_id,
    receiver_id,
    created_at,
    ROW_NUMBER() OVER (
      PARTITION BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)
      ORDER BY created_at DESC
    ) as rn
  FROM swap_requests
  WHERE status != 'rejected'
)
DELETE FROM swap_requests
WHERE id IN (
  SELECT id FROM ranked_requests WHERE rn > 1
);

-- Add unique constraint on the combination of sender_id and receiver_id
-- This prevents duplicate requests regardless of order
ALTER TABLE swap_requests 
ADD CONSTRAINT unique_sender_receiver 
UNIQUE (sender_id, receiver_id);

-- Add comment to explain the constraint
COMMENT ON CONSTRAINT unique_sender_receiver ON swap_requests IS 'Prevents duplicate swap requests between the same users';
