import { createClient } from '@supabase/supabase-js';

const getEnvVar = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const supabaseUrl =
  getEnvVar('VITE_SUPABASE_URL', '') ||
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL', '') ||
  getEnvVar('SUPABASE_URL', '') ||
  'https://vcpksmlezpwxljbydwse.supabase.co';

const supabaseAnonKey =
  getEnvVar('VITE_SUPABASE_ANON_KEY', '') ||
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '') ||
  getEnvVar('SUPABASE_ANON_KEY', '') ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjcGtzbWxlenB3eGxqYnlkd3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MjQ3NjUsImV4cCI6MjEwOTMwMDc2NX0.tB4k3zeA04c0Q5P5QW9OzW1c5w1hhFzV4235IsUAnRc';

export const isSupabaseClientConfigured = Boolean(
  supabaseUrl && !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
