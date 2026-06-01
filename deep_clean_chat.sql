-- SQL Deep Clean: Delete orphaned messages and conversations
-- Clean up messages table
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM auth.users) OR receiver_id NOT IN (SELECT id FROM auth.users);

-- Clean up conversations table (if it exists)
DELETE FROM public.conversations WHERE participant_one NOT IN (SELECT id FROM auth.users) OR participant_two NOT IN (SELECT id FROM auth.users);

-- Verify cleanup worked
SELECT COUNT(*) as remaining_orphaned_messages FROM public.messages WHERE sender_id NOT IN (SELECT id FROM auth.users) OR receiver_id NOT IN (SELECT id FROM auth.users);

SELECT COUNT(*) as remaining_orphaned_conversations FROM public.conversations WHERE participant_one NOT IN (SELECT id FROM auth.users) OR participant_two NOT IN (SELECT id FROM auth.users);

-- Check for any remaining invalid user references in chat data
SELECT DISTINCT sender_id, receiver_id FROM public.messages WHERE sender_id NOT IN (SELECT id FROM auth.users) OR receiver_id NOT IN (SELECT id FROM auth.users) LIMIT 10;
