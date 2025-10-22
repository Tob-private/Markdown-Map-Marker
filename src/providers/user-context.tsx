'use client'
import { createContext, useEffect, useState, ReactNode } from 'react'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { User } from '@supabase/supabase-js'

export const UserContext = createContext<User | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = getBrowserSupabase()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Fetch initial user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
    }
    fetchUser()

    // Subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
      }
    )

    // Cleanup on unmount
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
