import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github, Chrome, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !password) {
      toast.error('Please enter your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Welcome back!');
      navigate('/explore');
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthComingSoon = (provider: 'Google' | 'GitHub') => {
    toast(`${provider} sign-in is coming soon — please use email for now`, { icon: 'ℹ️' });
  };

  const handleForgotPassword = async () => {
    const target = email.trim();
    if (!target) {
      toast.error('Enter your email above first, then click Forgot password');
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(target, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Password reset link sent — check your inbox');
    } catch (err) {
      console.error('Reset password error:', err);
      toast.error('Could not send reset email');
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 relative overflow-hidden bg-[#0f172a]">
      {/* Background Decals */}
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-400">Continue your swapping journey</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignIn}>
          <div className="space-y-2">
            <label htmlFor="login-email" className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-purple-500 transition-all focus:bg-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label htmlFor="login-password" className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[10px] uppercase font-bold text-purple-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                required
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing In…
              </>
            ) : (
              <>
                Sign In
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
            title="Google sign-in is coming soon"
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
            title="GitHub sign-in is coming soon"
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
          Social sign-in coming soon — use email for now
        </p>

        <div className="mt-10 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 font-bold hover:underline">
            Join free
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
