# 🔐 GitHub OAuth Setup for Supabase

## 🚀 Step-by-Step Instructions

### **Step 1: Enable GitHub Provider in Supabase**

1. **Go to your Supabase Project**
   - Visit [https://supabase.com](https://supabase.com)
   - Select your project: `osmcorskrooeciiynmew`

2. **Navigate to Authentication Settings**
   - Go to **Authentication** in the left sidebar
   - Click on **Providers** tab

3. **Enable GitHub Provider**
   - Find **GitHub** in the list
   - Toggle the **Enable** switch to **ON**
   - You'll see two fields: **Client ID** and **Client Secret**

### **Step 2: Create GitHub OAuth App**

1. **Go to GitHub Developer Settings**
   - Go to [https://github.com](https://github.com)
   - Click your profile picture → **Settings**
   - Scroll down → **Developer settings** (bottom left)
   - Click **OAuth Apps** → **New OAuth App**

2. **Fill OAuth App Details**
   ```
   Application name: SkillSwap App
   Homepage URL: http://localhost:3000
   Authorization callback URL: https://osmcorskrooeciiynmew.supabase.co/auth/v1/callback
   ```

3. **Register Application**
   - Click **Register application**
   - Copy the **Client ID**
   - Click **Generate a new client secret**
   - Copy the **Client Secret** (save it somewhere safe!)

### **Step 3: Configure Supabase GitHub Provider**

1. **Go back to Supabase**
   - In your GitHub provider settings
   - Paste the **Client ID** from GitHub
   - Paste the **Client Secret** from GitHub

2. **Save Configuration**
   - Click **Save** at the bottom

### **Step 4: Test the GitHub Login**

1. **Restart your development server**
   ```bash
   npm run dev
   ```

2. **Test the GitHub button**
   - Open your app
   - Click the auth modal
   - Click the GitHub icon
   - Should redirect to GitHub for authentication

## 🔧 Troubleshooting

### **Common Issues:**

1. **"Invalid redirect_uri" error**
   - Check that the callback URL in GitHub matches exactly:
   - `https://osmcorskrooeciiynmew.supabase.co/auth/v1/callback`

2. **"Client not found" error**
   - Make sure the Client ID is copied correctly
   - Check there are no extra spaces

3. **"Bad client credentials" error**
   - Regenerate the Client Secret in GitHub
   - Update the secret in Supabase

4. **WebSocket errors in Vite**
   - The vite.config.ts has been updated to fix this
   - Restart the dev server after changes

## 📋 Required Information Summary

### **GitHub OAuth App Settings:**
- **Application name**: SkillSwap App
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `https://osmcorskrooeciiynmew.supabase.co/auth/v1/callback`

### **Supabase Provider Settings:**
- **Client ID**: From GitHub OAuth app
- **Client Secret**: From GitHub OAuth app

## ✅ Success Indicators

When everything is working correctly:
- ✅ GitHub button redirects to GitHub
- ✅ GitHub shows authorization screen
- ✅ After authorization, redirects back to your app
- ✅ User is logged in successfully
- ✅ User data appears in localStorage

## 🎯 Next Steps

After GitHub is working, you can also enable Google provider following similar steps:
1. Enable Google provider in Supabase
2. Create Google OAuth app in Google Cloud Console
3. Configure redirect URI
4. Add credentials to Supabase

Your social login system will be fully functional! 🚀
