import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("SUPABASE CONFIGURATION ERROR: Check environmental keys missing.")
}

// Use placeholders during static generation/analysis if missing to prevent crash
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-for-build.supabase.co', 
  supabaseAnonKey || 'placeholder-key-for-build'
)
