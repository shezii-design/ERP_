import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserRole } from '../types/erp';

interface AuthContextType {
  user: any | null;
  session: any | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: 'Staff',
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  isConfigured: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>('Staff');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        if (mounted) {
          setSession(data?.session || null);
          const currentUser = data?.session?.user || null;
          setUser(currentUser);
          if (currentUser) {
            determineUserRole(currentUser);
          }
        }
      } catch (err) {
        console.error('Session retrieval exception:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, currentSession: any) => {
      if (mounted) {
        setSession(currentSession);
        const currentUser = currentSession?.user || null;
        setUser(currentUser);
        if (currentUser) {
          determineUserRole(currentUser);
        } else {
          setRole('Staff');
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const determineUserRole = (currentUser: any) => {
    // Check metadata, email pattern, or custom role
    const metaRole = currentUser?.user_metadata?.role;
    if (metaRole && ['Administrator', 'Manager', 'Staff'].includes(metaRole)) {
      setRole(metaRole);
      return;
    }
    const email = (currentUser?.email || '').toLowerCase();
    if (email.includes('admin') || email.includes('owner') || email.includes('boss')) {
      setRole('Administrator');
    } else if (email.includes('manager') || email.includes('lead') || email.includes('director')) {
      setRole('Manager');
    } else {
      setRole('Staff');
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      setSession(data?.session || null);
      setUser(data?.user || null);
      if (data?.user) {
        determineUserRole(data.user);
      }
      setLoading(false);
      return { error: null };
    } catch (err: any) {
      setLoading(false);
      return { error: { message: err.message || 'Authentication failed' } };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setUser(null);
      setSession(null);
      setRole('Staff');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        loading,
        signIn,
        signOut,
        isConfigured: isSupabaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
