'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import styles from './page.module.css'
import { SignUpFormState } from '@/lib/types/auth'
import { signUp } from '@/lib/actions/auth'

const initialState: SignUpFormState = {
  success: false,
  errors: {}
}
export default function Page() {
  const [, formAction] = useActionState(signUp, initialState)

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
        <section>
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
          />
        </section>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
