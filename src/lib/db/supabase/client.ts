'use client'

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function getBrowserSupabase(): SupabaseClient {
  if (browserClient) return browserClient

  // Create Supabase client
  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true, // store session in localStorage
        autoRefreshToken: true // refresh token automatically
      }
    }
  )

  // Base URL for fetch — works in dev and production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Sync session to server cookie automatically
  browserClient.auth.onAuthStateChange(async (event, session) => {
    try {
      await fetch(`${baseUrl}/sync-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: session?.access_token ?? null,
          refresh_token: session?.refresh_token ?? null,
          expires_at: session?.expires_at ?? null
        })
      })
    } catch (err) {
      console.error('Failed to sync Supabase session to server:', err)
    }
  })

  return browserClient
}
