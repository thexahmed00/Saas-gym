import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [gym,     setGym]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to Supabase auth state.
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // When the session changes, load the user's gym row.
  // The gym is created automatically by the on_auth_user_created trigger
  // (see supabase/migrations/0002_auth_and_gyms.sql).
  useEffect(() => {
    if (!session) {
      setGym(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('gyms')
        .select('id, name, city')
        .eq('owner_id', session.user.id)
        .maybeSingle();

      if (!cancelled) {
        if (error) console.error('Load gym error:', error.message);
        setGym(data ?? null);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [session]);

  const signIn  = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp  = (email, password, gymName) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: { gym_name: gymName },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

  const signOut = () => supabase.auth.signOut();

  const value = { session, user: session?.user ?? null, gym, loading, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
