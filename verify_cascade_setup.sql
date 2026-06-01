-- Verify Cascade Delete Setup
-- Check if cascade delete constraints are properly configured

SELECT 
  tc.table_name, 
  tc.constraint_name, 
  tc.delete_rule 
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.delete_rule = 'CASCADE'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Verify triggers are active
SELECT 
  trigger_name, 
  event_manipulation, 
  action_timing, 
  action_condition
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%user%'
ORDER BY trigger_name;

-- Check for any remaining orphaned data after cleanup
SELECT 
  'profiles' as table_name, 
  COUNT(*) as orphaned_count
FROM public.profiles 
WHERE user_id NOT IN (SELECT id FROM auth.users)

UNION ALL

SELECT 
  'skills' as table_name, 
  COUNT(*) as orphaned_count
FROM public.skills 
WHERE user_id NOT IN (SELECT id FROM auth.users)

UNION ALL

SELECT 
  'messages' as table_name, 
  COUNT(*) as orphaned_count
FROM public.messages 
WHERE sender_id NOT IN (SELECT id FROM auth.users)

UNION ALL

SELECT 
  'conversations' as table_name, 
  COUNT(*) as orphaned_count
FROM public.conversations 
WHERE participant_one NOT IN (SELECT id FROM auth.users) 
   OR participant_two NOT IN (SELECT id FROM auth.users);
