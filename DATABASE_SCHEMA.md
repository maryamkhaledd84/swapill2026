# 🗄️ Swapill Database Schema

> **⚠️ Outdated.** The canonical, working schema is now [`supabase/init.sql`](./supabase/init.sql). The chained migration files referenced in this doc (`001_…` through `044_…`) conflict with each other and should not be applied. See [README → Database Setup](./README.md#database-setup--إعداد-قاعدة-البيانات).

## 📋 Overview
Complete database schema for Swapill platform using Supabase PostgreSQL with Row Level Security (RLS).

## 🏗️ Table Structure

### **profiles**
Core user profile table linked to Supabase authentication.

```sql
CREATE TABLE public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills_offered TEXT[] DEFAULT '{}',
  skills_wanted TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### **Fields Description**
- **id**: Unique profile identifier
- **user_id**: Foreign key to auth.users table
- **full_name**: Display name for user profile
- **avatar_url**: Profile picture URL
- **bio**: User biography/description
- **skills_offered**: JSON array of skills user can teach
- **skills_wanted**: JSON array of skills user wants to learn
- **created_at**: Profile creation timestamp
- **updated_at**: Last profile update timestamp

## 🔐 Security Policies (RLS)

### **Public Access**
```sql
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
```

### **User Access**
```sql
-- Users can only modify their own profiles
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);
```

## 🔄 Automated Triggers

### **Profile Creation Trigger**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@')[1]),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 📊 Indexes

### **Performance Optimization**
```sql
CREATE INDEX profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX profiles_created_at_idx ON public.profiles(created_at);
```

## 🗂️ Migration Files

### **001_create_profiles.sql**
- Creates the profiles table structure
- Adds all necessary fields and indexes
- Includes table and column comments

### **002_create_rls_policies.sql**
- Implements Row Level Security policies
- Ensures users can only access their own data
- Allows public read access for profile discovery

### **003_create_profile_trigger.sql**
- Creates automated profile creation trigger
- Handles new user signup from any auth provider
- Extracts name from OAuth metadata or email

## 🚀 Implementation Steps

### **1. Run Migrations in Supabase**
1. Go to Supabase Dashboard → SQL Editor
2. Run each migration file in order:
   - `001_create_profiles.sql`
   - `002_create_rls_policies.sql` 
   - `003_create_profile_trigger.sql`

### **2. Verify Schema**
- Check that profiles table exists
- Verify RLS policies are enabled
- Test trigger with new user signup

### **3. Update Application Code**
- Update AuthModal to save profile data
- Add profile management components
- Implement skill matching algorithms

## 🎯 Usage Examples

### **Insert Profile**
```sql
INSERT INTO public.profiles (user_id, full_name, bio, skills_offered)
VALUES (
  'user-uuid',
  'John Doe',
  'Full-stack developer passionate about teaching',
  '["React", "TypeScript", "Node.js"]
);
```

### **Update Profile**
```sql
UPDATE public.profiles
SET 
  bio = 'Updated bio',
  skills_wanted = '["Python", "Machine Learning"]'
WHERE user_id = 'user-uuid';
```

## 🔍 Data Types

### **Skills Array Structure**
```typescript
interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  category: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  skills_offered: Skill[];
  skills_wanted: string[];
  created_at: string;
  updated_at: string;
}
```

This schema provides a robust foundation for the Swapill skill-sharing platform! 🎓✨
