
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jcjlcswhgfkoxkowwmac.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjamxjc3doZ2Zrb3hrb3d3bWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyOTk2NzksImV4cCI6MjA2Mjg3NTY3OX0.Zp20F9wtp9Xutk__zTue41wKGfEDwzso2vbo9lmkH3g";

// Create and export the supabase client with explicit configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
