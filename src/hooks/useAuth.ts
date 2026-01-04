import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { signIn, signUp, signOut, getCurrentUser } from '../utils/supabase/auth';
import type { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  profile?: any;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event);
        
        if (session?.user) {
          const { data: userData } = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    try {
      const { data, error } = await getCurrentUser();
      if (error) throw error;
      setUser(data);
    } catch (err) {
      setError(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      const { data: userData } = await getCurrentUser();
      setUser(userData);
      
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }

  async function register(email: string, password: string, name: string, role: 'customer' | 'driver' = 'customer') {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await signUp(email, password, name, role);
      if (error) throw error;
      
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setError(null);
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;
      
      setUser(null);
      return { error: null };
    } catch (err) {
      setError(err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCustomer: user?.profile?.role === 'customer',
    isDriver: user?.profile?.role === 'driver',
    isAdmin: user?.profile?.role === 'admin',
  };
}
