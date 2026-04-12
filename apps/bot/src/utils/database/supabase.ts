import { createClient } from '@supabase/supabase-js'
import type { Database } from '@suppora/shared'

/**`Supabase` Client - **ADMIN** */
export const supabase = createClient<Database>(process.env?.SUPABASE_URL, process.env?.SUPABASE_KEY)