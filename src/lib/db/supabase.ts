import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.dir({ SUPABASE_URL, SUPABASE_ANON_KEY })
  throw new Error('Supabase env var is undefined')
}

/**
 * @IMPORTANT
 * This can only be use on the server because the authentication happens server side.
 * Make sure it is either used in a server component or in a server action
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
