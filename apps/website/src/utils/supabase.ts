import { createClient } from "@supabase/supabase-js";
import type { Database } from '@suppora/shared'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!supabaseUrl) console.warn('(!) Missing SUPABASE URL from VITE ENV')
if (!supabaseKey) console.warn('(!) Missing SUPABASE KEY from VITE ENV')

/**@client `Supabase` - ***Browser Client*** */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);