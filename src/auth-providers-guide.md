# Authentication Backend Service Guide

## 🚀 Recommended Backend Services

### 1. **Firebase Authentication** (Recommended for Beginners)
**Pros:**
- Free tier with generous limits
- Easy setup with Google and GitHub providers
- Built-in UI components
- Excellent documentation
- Real-time database included

**Cons:**
- Vendor lock-in
- Limited customization

### 2. **Supabase** (Recommended for Modern Apps)
**Pros:**
- Open-source Firebase alternative
- PostgreSQL database
- Row-level security
- More control over data
- Excellent auth providers

**Cons:**
- Steeper learning curve
- Smaller community

### 3. **Auth0** (Enterprise-Grade)
**Pros:**
- Most comprehensive features
- Advanced security options
- Excellent documentation
- Many integrations

**Cons:**
- Expensive for small projects
- Complex setup

---

## 🔧 Implementation Code Examples

### Firebase Authentication Setup

#### Installation:
```bash
npm install firebase
```

#### Configuration (src/config/firebase.ts):
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
```

#### Updated AuthModal Functions:
```typescript
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';

const handleGoogleLogin = async () => {
  try {
    console.log('Initiating Google login...');
    toast.success('Redirecting to Google...');
    
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userData = {
      name: user.displayName || 'Google User',
      email: user.email || 'user@gmail.com',
      country: 'US',
      joinDate: new Date().toISOString(),
      uid: user.uid,
      photoURL: user.photoURL
    };
    
    localStorage.setItem('swapill_user', JSON.stringify(userData));
    toast.success(`Welcome, ${userData.name}!`);
    onAuthSuccess(userData);
    onClose();
  } catch (error) {
    console.error('Google login error:', error);
    toast.error('Failed to login with Google');
  }
};

const handleGithubLogin = async () => {
  try {
    console.log('Initiating GitHub login...');
    toast.success('Redirecting to GitHub...');
    
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    const userData = {
      name: user.displayName || 'GitHub User',
      email: user.email || 'user@github.com',
      country: 'US',
      joinDate: new Date().toISOString(),
      uid: user.uid,
      photoURL: user.photoURL
    };
    
    localStorage.setItem('swapill_user', JSON.stringify(userData));
    toast.success(`Welcome, ${userData.name}!`);
    onAuthSuccess(userData);
    onClose();
  } catch (error) {
    console.error('GitHub login error:', error);
    toast.error('Failed to login with GitHub');
  }
};
```

---

### Supabase Authentication Setup

#### Installation:
```bash
npm install @supabase/supabase-js
```

#### Configuration (src/config/supabase.ts):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'your-supabase-url';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### Updated AuthModal Functions:
```typescript
import { supabase } from '../config/supabase';

const handleGoogleLogin = async () => {
  try {
    console.log('Initiating Google login...');
    toast.success('Redirecting to Google...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Google login error:', error);
    toast.error('Failed to login with Google');
  }
};

const handleGithubLogin = async () => {
  try {
    console.log('Initiating GitHub login...');
    toast.success('Redirecting to GitHub...');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
  } catch (error) {
    console.error('GitHub login error:', error);
    toast.error('Failed to login with GitHub');
  }
};

// Handle OAuth callback (create a separate route)
// src/pages/AuthCallback.tsx
import { useEffect } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        const userData = {
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
          email: data.session.user.email || '',
          country: 'US',
          joinDate: new Date().toISOString(),
          uid: data.session.user.id
        };
        
        localStorage.setItem('swapill_user', JSON.stringify(userData));
        navigate('/dashboard');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Completing authentication...</div>
    </div>
  );
}
```

---

## 🎯 My Recommendation

**For your SkillSwap project, I recommend Firebase** because:

1. **Easy Setup**: Perfect for rapid development
2. **Free Tier**: No cost for your current scale
3. **Google & GitHub**: Built-in support for both providers
4. **Documentation**: Excellent resources available
5. **Community**: Large community for support

**Setup Steps:**
1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication → Google Provider & GitHub Provider
3. Add your domain to authorized domains
4. Install Firebase package
5. Use the Firebase code examples above

**Next Steps:**
1. Choose your backend service
2. Set up the project in the provider's console
3. Install the required packages
4. Replace the mock functions with real implementation
5. Test the authentication flow

Would you like me to help you set up Firebase or do you prefer Supabase?
