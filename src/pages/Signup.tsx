import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim() || '';
    const password = (formData.get('password') as string) || '';
    const confirmPassword = (formData.get('confirmPassword') as string) || '';

    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Email already exists. Please log in instead.');
        } else {
          toast.error(error.message || 'Failed to create account');
        }
        return;
      }

      if (!data.user) {
        toast.error('No user data returned');
        return;
      }

      toast.success('Account created!');

      // Auto sign-in
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast.error('Account created — please log in');
        navigate('/login');
        return;
      }

      // Allow the database trigger to create the profile row before we navigate
      setTimeout(async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          navigate('/profile');
        } else {
          toast.error('Login successful — please refresh the page');
        }
      }, 1500);
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthComingSoon = (provider: 'Google' | 'GitHub') => {
    toast(`${provider} sign-up is coming soon — please use email for now`, { icon: 'ℹ️' });
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 border-white/20"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join Swapill</h1>
          <p className="text-slate-400">Start your skill swapping journey</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="space-y-2">
            <label htmlFor="signup-name" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                placeholder="John Doe"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-password" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="signup-confirm" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Confirm Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                title={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account…
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center px-4">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase font-bold text-slate-600 bg-transparent px-4">
            <span className="px-2 backdrop-blur-md">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => handleOAuthComingSoon('Google')}
            title="Google sign-up is coming soon"
            className="relative flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium opacity-70"
          >
            <Chrome className="w-4 h-4" />
            Google
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[9px] uppercase font-bold text-purple-300 tracking-wider">
              Soon
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthComingSoon('GitHub')}
            title="GitHub sign-up is coming soon"
            className="relative flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium opacity-70"
          >
            <Github className="w-4 h-4" />
            GitHub
            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[9px] uppercase font-bold text-purple-300 tracking-wider">
              Soon
            </span>
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">
          Social sign-up coming soon — use email for now
        </p>

        <div className="mt-10 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 font-bold hover:underline">
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
