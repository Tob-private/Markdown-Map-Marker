'use client'
import UserProfile from './user-profile'
import styles from './header.module.css'
import { useEffect, useState } from 'react'
import { AuthError, User } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import Link from 'next/link'

export default function Header() {
  const supabase = getBrowserSupabase()

  const [user, setUser] = useState<User | null>(null)
  const [userError, setUserError] = useState<AuthError | null>(null)

  useEffect(() => {
    const user = supabase.auth.getUser()

    user.then((response) => {
      if (response.data && !response.error) {
        setUser(response.data.user)
      } else if (response.error && !response.data) {
        setUserError(response.error)
      }
    })

    if (userError) {
      console.error('Error getting user')
      console.error(userError)
    }
  }, [supabase.auth, userError])

  return (
    <header className={styles.header}>
      {user ? <UserProfile /> : <Link href={'/login'}>Login</Link>}
    </header>
  )
}
