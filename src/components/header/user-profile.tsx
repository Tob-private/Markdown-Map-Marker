'use client'
import { signOut } from '@/lib/actions/auth'
import { Button, Popover } from 'antd'
import { CircleUser } from 'lucide-react'
import styles from './user-profile.module.css'

const content = (
  <Button onClick={signOut} className={styles.logout}>
    Log out
  </Button>
)

export default function UserProfile() {
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
