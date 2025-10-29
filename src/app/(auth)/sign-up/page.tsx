'use client'
import Link from 'next/link'
import { useActionState } from 'react'
import styles from './page.module.css'
import { SignUpFormState } from '@/lib/types/auth'
import { authWithGithub, signUp } from '@/lib/actions/auth'
import ErrorMessage from '@/components/form/error-message'
import LoginProvider from '@/components/auth/login-provider'

const initialState: SignUpFormState = {
  success: false,
  errors: {}
}
export default function Page() {
  const [state, formAction, isPending] = useActionState(signUp, initialState)

  return (
    <main className={styles.main}>
      <h1>Sign Up</h1>
      <p>
        Already have an account? <Link href={'/login'}>Login</Link>
      </p>
      <LoginProvider
        btnText="Login with Github"
        provider="github"
        providerIcon="/github.png"
        onClickFunc={authWithGithub}
      />

      <form action={formAction}>
        <section className={styles.section}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" autoComplete="email" />
          {!state.success &&
            state.errors.email?.map((error, index) => (
              <ErrorMessage error={error} key={error.substring(5) + index} />
            ))}
        </section>
        <section className={styles.section}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
          />
          {!state.success &&
            state.errors.password?.map((error, index) => (
              <ErrorMessage error={error} key={error.substring(5) + index} />
            ))}
        </section>
        <section className={styles.section}>
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            autoComplete="new-password"
          />
          {!state.success &&
            state.errors.confirm_password?.map((error, index) => (
              <ErrorMessage error={error} key={error.substring(5) + index} />
            ))}
        </section>
        <button type="submit" disabled={isPending}>
          Sign up
        </button>
      </form>
    </main>
  )
}
