'use server'
import { createClient } from '@supabase/supabase-js'
import type {
  SupabaseClient,
  SupabaseClientOptions
} from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function createServerSupabase(
  accessToken?: string
): Promise<SupabaseClient> {
  const options: SupabaseClientOptions<'public'> | undefined = {}

  if (accessToken) {
    options.global = {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options)
}

/**
 * Creates a Supabase client tied to a user's session token stored in cookies.
 * Useful for Server Components or Server Actions.
 */
export async function createServerSupabaseFromCookies(): Promise<SupabaseClient> {
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-access-token')?.value
  return createServerSupabase(token)
}
