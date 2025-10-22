'use client'
import { signOut } from '@/lib/actions/auth'
import { Button, Popover } from 'antd'
import { CircleUser } from 'lucide-react'
import styles from './user-profile.module.css'
import { useRouter } from 'next/navigation'

export default function UserProfile() {
  const router = useRouter()
  const handleSignout = () => {
    signOut()
    router.replace('/login')
  }

  const content = (
    <Button onClick={handleSignout} className={styles.logout}>
      Log out
    </Button>
  )
  return (
    <Popover
      content={content}
      title="Profile"
      trigger="click"
      styles={{
        body: { backgroundColor: 'var(--color-base-70)', color: '#ff0000' }
      }}
    >
      <CircleUser />
    </Popover>
  )
}
