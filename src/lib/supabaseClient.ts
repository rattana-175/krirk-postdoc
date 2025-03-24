import { createClient } from '@supabase/supabase-js'

// รับค่า URL และ anon key จาก environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// ตรวจสอบว่ามีค่าหรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.')
}

// สร้าง Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)