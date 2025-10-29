'use client'
import { signOut } from '@/lib/actions/auth'
import { CircleUser } from 'lucide-react'
import styles from './user-profile.module.css'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { User } from '@supabase/supabase-js'

export default function UserProfile({ user }: { user: User }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={styles.popover_trigger}>
          <CircleUser size={50} />
          <div>
            <h5>
              {user.user_metadata.user_name
                .split('.')
                .join(' ')
                .split('-')
                .join(' ') ??
                user.user_metadata.email
                  .split('@')[0]
                  .split('.')
                  .join(' ')
                  .split('-')
                  .join(' ')}
            </h5>
            <p>{user.user_metadata.email}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className={styles.popover_content}>
        <Button onClick={signOut} className={styles.logout}>
          Log out
        </Button>
      </PopoverContent>
    </Popover>
  )
}
