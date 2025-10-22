'use client'
import { signOut } from '@/lib/actions/auth'
import { CircleUser } from 'lucide-react'
import styles from './user-profile.module.css'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'

export default function UserProfile() {
  const router = useRouter()

  return (
    <Popover>
      <PopoverTrigger asChild className={styles.popover_trigger}>
        <CircleUser />
      </PopoverTrigger>
      <PopoverContent className={styles.popover_content}>
        <Button onClick={signOut} className={styles.logout}>
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  )
}
