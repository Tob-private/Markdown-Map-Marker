'use client'
import { signOut } from '@/lib/actions/auth'
import { User } from '@supabase/supabase-js'
import { CircleUser } from 'lucide-react'

export default function UserProfile() {
  return <CircleUser onClick={signOut} />
}
