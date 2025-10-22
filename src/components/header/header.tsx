'use client'
import UserProfile from './user-profile'
import styles from './header.module.css'
import { useContext } from 'react'
import Link from 'next/link'
import { UserContext } from '@/providers/user-context'

export default function Header() {
  const user = useContext(UserContext)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.auth}>
          {user ? <UserProfile /> : <Link href={'/login'}>Login</Link>}
        </div>
      </div>
    </header>
  )
}
