import { AuthError } from '@supabase/supabase-js'
import z from 'zod'

export type LoginFormState =
  | {
      success: true
      data: {
        email: string
        password: string
      }
    }
  | {
      success: false
      errors: {
        email?: string[]
        password?: string[]
        supabaseError?: AuthError
      }
    }

export const loginFormSchema = z.object({
  email: z.email('Email is not a valid email'),
  password: z.string().min(6, 'Password must be minimum 6 characters long')
})
