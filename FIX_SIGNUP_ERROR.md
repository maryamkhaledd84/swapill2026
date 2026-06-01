# 🔧 Fix Database Error for New User Signup

> **⚠️ Resolved.** This was caused by the conflicting `supabase/migrations/*.sql` files. The fix is to use [`supabase/init.sql`](./supabase/init.sql) instead, which includes a working `handle_new_user` trigger that auto-creates a `profiles` row on signup. See [README → Database Setup](./README.md#database-setup--إعداد-قاعدة-البيانات). This file is kept for historical context only.

## 🚨 Problem
Users getting "Database error saving new user" when trying to sign up for new accounts.

## ✅ Solution
Run these new migrations in order to fix the database schema and trigger:

### 📋 Migration Files to Run

1. **006_add_rating_and_swaps_to_profiles.sql**
   - Adds missing `rating` column (DEFAULT 0.0)
   - Adds missing `swaps_count` column (DEFAULT 0)
   - Creates performance indexes

2. **007_update_profile_trigger.sql**
   - Updates `handle_new_user()` function to include new columns
   - Sets proper default values for new users
   - Recreates the trigger with updated function

3. **008_fix_trigger_rls_bypass.sql**
   - Fixes RLS (Row Level Security) bypass for trigger operations
   - Adds service role policy for profile creation
   - Ensures trigger can insert profiles regardless of RLS

## 🚀 How to Apply the Fix

### Step 1: Go to Supabase Dashboard
1. Navigate to your Supabase project
2. Go to **SQL Editor** in the left sidebar

### Step 2: Run Migrations in Order
Copy and paste each migration file content into the SQL Editor and run them sequentially:

```sql
-- Run 006_add_rating_and_swaps_to_profiles.sql first
-- Then run 007_update_profile_trigger.sql  
-- Finally run 008_fix_trigger_rls_bypass.sql
```

### Step 3: Verify the Fix
1. Try creating a new test account
2. Check if the profile is created successfully in the `profiles` table
3. Verify the new user has `rating = 0.0` and `swaps_count = 0`

## 🎯 What Was Fixed

### Database Schema Issues
- **Missing Columns**: The `profiles` table was missing `rating` and `swaps_count` columns that the Explore.tsx code expected
- **Default Values**: New users now get proper default values instead of NULL

### Trigger Function Issues  
- **Column Mismatch**: The trigger was trying to insert into columns that didn't exist
- **RLS Conflict**: Row Level Security was blocking the trigger from inserting profiles
- **Service Role**: Added bypass for service role operations

### RLS Policy Issues
- **Insert Permission**: Added policy to allow service role to create profiles
- **Security Bypass**: Trigger now properly bypasses RLS for profile creation

## 🔍 Verification Commands

After running migrations, verify the schema:

```sql
-- Check if new columns exist
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name IN ('rating', 'swaps_count');

-- Check if trigger exists
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'profiles';
```

## 🎉 Expected Result

After applying these fixes:
- ✅ New user signups should work without database errors
- ✅ Profiles are automatically created with proper default values
- ✅ Explore page displays users correctly with rating and swap counts
- ✅ All 30 experts show up properly in the interface

## 📞 Support

If issues persist after running migrations:
1. Check Supabase logs for specific error messages
2. Verify all migrations ran successfully
3. Ensure the trigger function is properly created
4. Test with a completely new user account
