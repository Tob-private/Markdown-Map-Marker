'use client'
import styles from './page.module.css'
import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/lib/actions/auth-form'
import { LoginFormState } from '@/lib/types/auth'

const initialState: LoginFormState = {
  success: false,
  errors: {}
}

export default function Page() {
  const [, formAction] = useActionState(login, initialState)

  return (
    <main className={styles.main}>
      <h1>Login</h1>
      <p>
        Don&apos;t have an account? <Link href={'/sign-up'}>Sign up</Link>
      </p>
      <form action={formAction}>
        <section>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" />
        </section>
        <section>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
        </section>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
