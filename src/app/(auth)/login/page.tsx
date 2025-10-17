'use client'
import { getBrowserSupabase } from '@/lib/db/supabase/client'

export default function Page() {
  const supabase = getBrowserSupabase()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: process.env.NEXT_PUBLIC_SUPABASE_USER_EMAIL!,
      password: process.env.NEXT_PUBLIC_SUPABASE_USER_PW!
    })

    if (error) return console.error(error)
    console.log('Logged in')
  }
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) return console.error(error)
    console.log('Logged out')
  }

  return (
    <>
      <div style={{ padding: '2rem' }}>
        <button onClick={() => handleLogin()}>Login</button>
        <button onClick={() => handleLogout()}>Logout</button>
      </div>
    </>
  )
}
