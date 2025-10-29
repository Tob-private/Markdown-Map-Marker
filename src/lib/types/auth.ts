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
export type SignUpFormState =
  | {
      success: true
      data: {
        email: string
        password: string
        confirm_password: string
      }
    }
  | {
      success: false
      errors: {
        email?: string[]
        password?: string[]
        confirm_password?: string[]
        supabaseError?: AuthError
      }
    }

export type SignOutResult =
  | { success: true }
  | { success: false; error: AuthError }

export type OAuthSignInResult =
  | { success: true }
  | { success: false; error: AuthError }

export const loginFormSchema = z.object({
  email: z.email('Email is not a valid email'),
  password: z.string().min(6, 'Password must be minimum 6 characters long')
})
export const signUpFormSchema = z
  .object({
    email: z.email('Email is not a valid email'),
    password: z.string().min(6, 'Password must be minimum 6 characters long'),
    confirm_password: z
      .string()
      .min(6, 'Password must be minimum 6 characters long')
  })
  .refine((data) => data.password === data.confirm_password, {
    error: 'Passwords dont match',
    path: ['confirm_password']
  })

export type AuthProvider = 'github' // This is overly complicated now to allow for ease of expansion later with more providers later
