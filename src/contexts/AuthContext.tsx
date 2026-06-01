import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../config/supabase';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    [key: string]: any;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isInitialLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const toAuthUser = (sessionUser: any): AuthUser => ({
  id: sessionUser.id,
  email: sessionUser.email || '',
  full_name: sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name,
  avatar_url: sessionUser.user_metadata?.avatar_url,
  created_at: sessionUser.created_at,
  user_metadata: sessionUser.user_metadata || {},
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ? toAuthUser(session.user) : null);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      // Cap initial auth loading so we don't get stuck on a blank screen if the
      // network or Supabase is slow.
      const loadingTimeout = setTimeout(() => {
        setIsInitialLoading(false);
        setLoading(false);
      }, 8000);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) setUser(toAuthUser(session.user));
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
      } finally {
        clearTimeout(loadingTimeout);
        setIsInitialLoading(false);
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(toAuthUser(session.user));
          setLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(toAuthUser(session.user));
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isInitialLoading,
    signOut,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
