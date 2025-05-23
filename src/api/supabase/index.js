import { createClient } from '@supabase/supabase-js';
console.log()
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log(supabaseKey)
export const supabase = createClient(supabaseUrl, supabaseKey);