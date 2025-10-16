'use client'
import { useEffect } from 'react'
import { createIcons, icons } from 'lucide'

export default function LucideProvider() {
  useEffect(() => {
    createIcons({ icons })
  }, [])
  return null
}
