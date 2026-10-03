/**
 * Supabase Client Initialization
 * Reads environment variables: import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_ANON_KEY
 */

declare global {
  interface Window {
    supabase?: {
      createClient: (url: string, key: string, options?: any) => any;
    };
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const isSupabaseConfigured = isConfigured;

let client: any = null;

if (isConfigured && window.supabase) {
  try {
    client = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

export const supabase = client || (window.supabase && supabaseUrl && supabaseAnonKey ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : {
  auth: {
    signInWithPassword: async () => ({
      data: { user: null, session: null },
      error: { message: 'Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured.' }
    }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) })
  })
});
