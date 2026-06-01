-- Verify Chat Tables Cascade Delete Constraints
-- Check messages table foreign key constraints
SELECT 
  tc.table_name, 
  tc.constraint_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND (tc.table_name = 'messages' OR tc.table_name = 'conversations')
ORDER BY tc.table_name, tc.constraint_name;

-- Check if messages table needs cascade delete setup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_sender_id_fkey' 
    AND table_name = 'messages'
    AND delete_rule = 'CASCADE'
  ) THEN
    RAISE NOTICE 'Messages table sender_id constraint needs CASCADE setup';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'messages_receiver_id_fkey' 
    AND table_name = 'messages'
    AND delete_rule = 'CASCADE'
  ) THEN
    RAISE NOTICE 'Messages table receiver_id constraint needs CASCADE setup';
  END IF;
END $$;

-- Check conversations table constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_participant_one_fkey' 
    AND table_name = 'conversations'
    AND delete_rule = 'CASCADE'
  ) THEN
    RAISE NOTICE 'Conversations table participant_one constraint needs CASCADE setup';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'conversations_participant_two_fkey' 
    AND table_name = 'conversations'
    AND delete_rule = 'CASCADE'
  ) THEN
    RAISE NOTICE 'Conversations table participant_two constraint needs CASCADE setup';
  END IF;
END $$;
