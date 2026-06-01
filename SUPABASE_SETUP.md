# 🔐 Supabase Authentication Setup Guide

> **⚠️ Partially superseded.** For database setup use the canonical schema in [`supabase/init.sql`](./supabase/init.sql) — see the [Database Setup](./README.md#database-setup--إعداد-قاعدة-البيانات) and [Deployment](./README.md#deployment--النشر) sections of the README. This file is still useful as a step-by-step for the OAuth provider configuration only.


## 📋 Environment Variables Setup

**IMPORTANT**: Add these to your `.env` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
```

## 🚀 Supabase Project Setup

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/login with GitHub
4. Create new project
5. Choose organization and project name
6. Set database password (save it!)
7. Choose region closest to you
8. Click "Create new project"

### 2. Enable Authentication Providers
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider:
   - Toggle "Enabled" on
   - Add your Google Client ID and Client Secret
   - Set Authorized Redirect URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
4. Enable **GitHub** provider:
   - Toggle "Enabled" on
   - Add your GitHub Client ID and Client Secret
   - Set same Authorized Redirect URI

### 3. Get Your Credentials
1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 4. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://[YOUR-DOMAIN]/auth/callback`
7. Copy Client ID and Client Secret to Supabase

### 5. GitHub OAuth Setup
1. Go to GitHub → **Settings** → **Developer settings** → **OAuth Apps**
2. Click **New OAuth App**
3. Fill in:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy Client ID and generate Client Secret
6. Add both to Supabase GitHub provider

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Configure Supabase Client
The client is already configured in `src/config/supabase.ts`

### 3. Add Auth Callback Route
The callback handler is created in `src/pages/AuthCallback.tsx`

### 4. Update Your Router
Add the auth callback route to your main router:

```typescript
// In your main router file
import AuthCallback from './pages/AuthCallback';

// Add this route
<Route path="/auth/callback" element={<AuthCallback />} />
```

## 🎯 Testing the Implementation

### 1. Start Your App
```bash
npm run dev
```

### 2. Test Google Login
1. Open the auth modal
2. Click the Google icon
3. You should be redirected to Google
4. Complete Google authentication
5. You should be redirected back to `/auth/callback`
6. Then redirected to `/dashboard`

### 3. Test GitHub Login
1. Open the auth modal
2. Click the GitHub icon
3. You should be redirected to GitHub
4. Complete GitHub authentication
5. You should be redirected back to `/auth/callback`
6. Then redirected to `/dashboard`

## 🔍 Troubleshooting

### Common Issues:
1. **"Missing Supabase environment variables"**
   - Make sure `.env` file exists with correct variables
   - Restart your dev server after adding env vars

2. **"Invalid redirect_uri"**
   - Check your OAuth provider settings
   - Ensure the callback URL matches exactly

3. **"No authentication session found"**
   - Check Supabase logs for errors
   - Ensure OAuth providers are properly configured

4. **CORS Issues**
   - Add your development URL to Supabase CORS settings
   - Go to Project Settings → API → CORS

## 📱 Production Deployment

### 1. Update Environment Variables
Add production Supabase URL and keys to your hosting environment

### 2. Update Redirect URIs
Add your production domain to OAuth providers:
- `https://your-domain.com/auth/callback`

### 3. Update Supabase CORS
Add your production domain to Supabase CORS settings

## ✅ What's Implemented

- ✅ Supabase client configuration
- ✅ Real Google OAuth login
- ✅ Real GitHub OAuth login  
- ✅ Auth callback handler
- ✅ Automatic redirect to dashboard
- ✅ User data storage in localStorage
- ✅ Error handling and toast notifications
- ✅ Loading states

## 🎉 Next Steps

1. Set up your Supabase project
2. Configure OAuth providers
3. Add environment variables
4. Test the authentication flow
5. Deploy to production

Your authentication system is now ready for real users! 🚀
