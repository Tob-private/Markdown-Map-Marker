'use client'
import { signOut } from '@/lib/actions/auth'
import { CircleUser } from 'lucide-react'

export default function UserProfile() {
  return <CircleUser onClick={signOut} />
}
