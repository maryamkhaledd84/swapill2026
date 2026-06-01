import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';

// Sign Up function (إنشاء حساب جديد)
export const signUp = async (email: string, password: string, fullName?: string) => {
  try {
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0], // Use name or email as fallback
        }
      }
    });
    
    if (error) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      return { success: false, error: error.message };
    }
    
    
    // Insert user into 'users' table after successful auth
    if (data.user) {
      const username = fullName || email.split('@')[0];
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email,
          username: username, 
          avatar_url: null,
          skills: [],
          created_at: new Date()
        }
      ]);
      
      if (insertError) {
        console.error('Error inserting user into users table:', insertError);
        toast.error('Account created but failed to save user data');
        return { success: true, data, warning: 'User data not saved' };
      }
    }
    
    toast.success('Account created successfully!');
    return { success: true, data };
    
  } catch (error) {
    console.error('Unexpected sign up error:', error);
    toast.error('An unexpected error occurred');
    return { success: false, error: 'Unexpected error' };
  }
};

// Login function (تسجيل دخول)
export const signIn = async (email: string, password: string) => {
  try {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    }
    
    toast.success('Welcome back!');
    return { success: true, data };
    
  } catch (error) {
    console.error('Unexpected sign in error:', error);
    toast.error('An unexpected error occurred');
    return { success: false, error: 'Unexpected error' };
  }
};

// Sign Out function
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      return { success: false, error: error.message };
    }
    
    toast.success('Signed out successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Unexpected sign out error:', error);
    toast.error('An unexpected error occurred');
    return { success: false, error: 'Unexpected error' };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Get user error:', error);
      return { success: false, error: error.message, user: null };
    }
    
    return { success: true, user };
    
  } catch (error) {
    console.error('Unexpected get user error:', error);
    return { success: false, error: 'Unexpected error', user: null };
  }
};
