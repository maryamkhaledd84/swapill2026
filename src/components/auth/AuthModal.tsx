import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Code, Palette, Music, FileText, TrendingUp, Users, Globe, ChevronDown } from "lucide-react";
import toast from 'react-hot-toast';
import { Chrome, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onAuthSuccess: (userData: { name: string; email: string; skill?: string }) => void;
}

interface FormData {
  name: string;
  email: string;
  country: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  country?: string;
  password?: string;
}

// Country data with flags
const COUNTRIES = [
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
];

export default function AuthModal({ isOpen, onClose, mode, onModeChange, onAuthSuccess }: AuthModalProps) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    country: 'EG', // Default to Egypt
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Load saved user data on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('swapill_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setFormData(prev => ({ 
        ...prev, 
        email: user.email, 
        name: user.name || '',
        country: user.country || 'EG'
      }));
    }
  }, []);

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string) => {
    const newErrors: FormErrors = {};
    
    if (name === 'name' && mode === 'signup' && !value.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (name === 'email') {
      if (!value.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    
    if (name === 'country' && mode === 'signup' && !value) {
      newErrors.country = 'Please select your country';
    }
    
    
    if (name === 'password') {
      if (!value) {
        newErrors.password = 'Password is required';
      } else if (value.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const mockAuthCall = async () => {
    // Simulate API call with 1.5 second delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get saved user data from localStorage for validation
    const savedUser = localStorage.getItem('swapill_user');
    
    // For signup mode - create new user
    if (mode === 'signup') {
      const userData = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        country: formData.country,
        password: formData.password, // Save password for demo validation
        joinDate: new Date().toISOString(),
      };
      
      // Save to localStorage with consistent key
      localStorage.setItem('swapill_user', JSON.stringify(userData));
      
      return {
        success: true,
        user: userData
      };
    }
    
    // For login mode - validate existing user
    if (mode === 'login') {
      if (!savedUser) {
        return {
          success: false,
          error: 'No account found. Please sign up first.'
        };
      }
      
      const userData = JSON.parse(savedUser);
      
      // Validate email
      if (formData.email !== userData.email) {
        return {
          success: false,
          error: 'No account found. Please sign up first.'
        };
      }
      
      // For demo purposes, validate password length
      if (!formData.password || formData.password.length < 6) {
        return {
          success: false,
          error: 'Incorrect password'
        };
      }
      
      return {
        success: true,
        user: userData
      };
    }
    
    return {
      success: false,
      error: 'Authentication failed'
    };
  };

  // Real Supabase social login functions
  const handleGoogleLogin = async () => {
    try {
      if (!supabase) {
        toast.error('Supabase not configured. Please add environment variables.');
        return;
      }
      
      toast.success('Redirecting to Google...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        toast.error('Failed to login with Google');
        return;
      }
      
      
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Failed to login with Google');
    }
  };

  const handleGithubLogin = async () => {
    try {
      if (!supabase) {
        toast.error('Supabase not configured. Please add environment variables.');
        return;
      }
      
      toast.success('Redirecting to GitHub...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('GitHub login error:', error);
        toast.error('Failed to login with GitHub');
        return;
      }
      
      
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('Failed to login with GitHub');
    }
  };

  // Legacy function for compatibility
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    if (provider === 'google') {
      await handleGoogleLogin();
    } else {
      await handleGithubLogin();
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      
      if (!supabase) {
        toast.error('Supabase not configured. Please add environment variables.');
        return;
      }
      
      let data, error;
      
      if (mode === 'signup') {
        // Sign up with Supabase
        const result = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              country: formData.country,
            }
          }
        });
        data = result.data;
        error = result.error;
      } else {
        // Sign in with Supabase
        const result = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        data = result.data;
        error = result.error;
      }
      
      
      if (error) {
        console.error('Auth error:', error);
        toast.error(error.message || 'Authentication failed');
        return;
      }
      
      if (data.user) {
        // Show success toast
        toast.success(mode === 'login' ? 'Welcome back!' : 'Account created successfully!');
        
        // Close modal
        onClose();
        
        // Redirect to profile page - AuthProvider will handle the state update
        setTimeout(() => {
          navigate('/profile');
        }, 300);
      } else {
        toast.error('No user data returned');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = handleEmailPasswordSubmit;

  return (
    <AnimatePresence> 
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/50"
          onClick={onClose}
        >
          {/* Glow behind modal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[150px] animate-pulse" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl shadow-purple-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {mode === 'login' ? 'Welcome Back' : 'Join Swapill'}
                </h2>
                <p className="text-gray-300 text-sm">
                  {mode === 'login' 
                    ? 'Sign in to continue swapping skills' 
                    : 'Start your skill swapping journey today'
                  }
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.name && touched.name
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          required
                        />
                        {errors.name && touched.name && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.email && touched.email
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          required
                        />
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your password"
                          autoComplete="new-password"
                          autoCorrect="off"
                          spellCheck="false"
                          className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.password && touched.password
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {errors.password && touched.password && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                          onBlur={() => setTimeout(() => setCountryDropdownOpen(false), 200)}
                          className={`w-full pl-10 pr-10 py-3 bg-white/5 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all text-left flex items-center justify-between cursor-pointer ${
                            errors.country && touched.country
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <span>
                              {formData.country ? (
                                <span className="flex items-center gap-2">
                                  <span>{COUNTRIES.find(c => c.code === formData.country)?.flag}</span>
                                  <span>{COUNTRIES.find(c => c.code === formData.country)?.name}</span>
                                </span>
                              ) : (
                                <span className="text-gray-500">Select your country</span>
                              )}
                            </span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {countryDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl z-50 max-h-60 overflow-hidden">
                            <div className="p-2 border-b border-white/10">
                              <input
                                type="text"
                                placeholder="Search country..."
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-sm"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto">
                              {filteredCountries.map((country) => (
                                <button
                                  key={country.code}
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({ ...prev, country: country.code }));
                                    setCountryDropdownOpen(false);
                                    setCountrySearch('');
                                    validateField('country', country.code);
                                  }}
                                  className="w-full px-3 py-2 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-sm text-white"
                                >
                                  <span className="text-lg">{country.flag}</span>
                                  <span>{country.name}</span>
                                  <span className="text-gray-400 text-xs">{country.dialCode}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {errors.country && touched.country && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'login' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.email && touched.email
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          required
                        />
                        {errors.email && touched.email && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.email}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          autoCorrect="off"
                          spellCheck="false"
                          className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                            errors.password && touched.password
                              ? 'border-red-500 focus:ring-red-500/20'
                              : 'border-white/10 focus:border-purple-500 focus:ring-purple-500/20'
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        {errors.password && touched.password && (
                          <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                            <AlertCircle className="w-3 h-3" />
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Login Divider */}
                {mode === 'signup' && (
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-900 text-gray-500">or continue with</span>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Chrome className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleGithubLogin}
                      disabled={isLoading}
                      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-gray-300 transition-all duration-200 hover:bg-white/10 hover:border-white/20 hover:scale-110 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Github className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                  )}
                </button>
              </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
                  className="ml-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
