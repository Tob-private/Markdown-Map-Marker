'use client'
import styles from './page.module.css'
import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import { LoginFormState } from '@/lib/types/auth'
import ErrorMessage from '@/components/form/error-message'

const initialState: LoginFormState = {
  success: false,
  errors: {}
}

export default function Page() {
  const [state, formAction] = useActionState(login, initialState)

  return (
    <main className={styles.main}>
      <h1>Login</h1>
      <p>
        Don&apos;t have an account? <Link href={'/sign-up'}>Sign up</Link>
      </p>
      <form action={formAction}>
        <section className={styles.section}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" />
          {!state.success &&
            state.errors.email?.map((error, index) => (
              <ErrorMessage error={error} key={error.substring(5) + index} />
            ))}
        </section>
        <section className={styles.section}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" />
          {!state.success &&
            state.errors.password?.map((error, index) => (
              <ErrorMessage error={error} key={error.substring(5) + index} />
            ))}
        </section>
        <button type="submit">Login</button>
      </form>
    </main>
  )
}
