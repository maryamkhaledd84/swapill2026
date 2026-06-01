# 🚨 IMPORTANT: Create Your .env File

> **ℹ️ Note.** The current `src/config/supabase.ts` ships with a hardcoded fallback URL/anon key, so the dev app boots without an `.env`. For your own deployment you should still create one — see [README → Environment Variables](./README.md#environment-variables--متغيرات-البيئة).

## The Error You're Seeing
```
supabase.ts:7 Uncaught Error: Missing Supabase environment variables. Please check your .env file.
```

## 🔧 How to Fix It

### Step 1: Create the .env file
Create a new file named `.env` in your project root (same level as package.json)

### Step 2: Add these variables to your .env file
```bash
# Supabase Configuration (get these from your Supabase project)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Get Your Supabase Credentials
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project or select existing one
3. Go to Project Settings → API
4. Copy the **Project URL** and **anon public** key
5. Replace the placeholder values in your .env file

### Step 4: Restart Your Development Server
```bash
npm run dev
```

## 📋 Example .env file
```bash
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ✅ What I've Fixed for You
- The app no longer crashes when environment variables are missing
- You'll see helpful warnings in the console instead
- Social login buttons will show a clear error message if not configured

## 🎯 Next Steps
1. Create your .env file with the variables above
2. Get your Supabase credentials
3. Restart the development server
4. Test the social login buttons

The app will work perfectly once you add the environment variables! 🚀
