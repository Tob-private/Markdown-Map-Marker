'use client'
import { signOut } from '@/lib/actions/auth'
import { CircleUser } from 'lucide-react'
import styles from './user-profile.module.css'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { User } from '@supabase/supabase-js'

export default function UserProfile({
  setUser
}: {
  setUser: (value: React.SetStateAction<User | null>) => void
}) {
  const router = useRouter()
  const handleSignout = () => {
    signOut()
    setUser(null)
    router.replace('/login')
  }

  return (
    <Popover>
      <PopoverTrigger asChild className={styles.popover_trigger}>
        <CircleUser />
      </PopoverTrigger>
      <PopoverContent className={styles.popover_content}>
        <Button onClick={handleSignout} className={styles.logout}>
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  )
}
