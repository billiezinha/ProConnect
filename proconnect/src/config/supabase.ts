import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
if (!supabaseUrl || !supabaseKey) throw new Error("Keys do Supabase não estão setadas!!!!!")
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase