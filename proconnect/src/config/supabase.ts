import { createClient } from "@supabase/supabase-js";

// As variáveis de ambiente devem estar no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;  // Use a variável de ambiente para URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;  // Use a variável de ambiente para a chave

// Verificar se as chaves estão configuradas corretamente
if (!supabaseUrl || !supabaseKey) {
  throw new Error("As chaves do Supabase não estão setadas!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
