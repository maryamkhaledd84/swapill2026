import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rkioxhfscqbhzutxltya.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraW94aGZzY3FiaHp1dHhsdHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyOTc5OTYsImV4cCI6MjA5NTg3Mzk5Nn0.lRHdlZvWZ9aOE1z769GdYwYKjQoCwrHPPICFRHwtFLI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
