'use client'
import z from 'zod'
import { getBrowserSupabase } from '../db/supabase/client'
import {
  GithubSignInResult,
  loginFormSchema,
  LoginFormState,
  SignOutResult,
  signUpFormSchema,
  SignUpFormState
} from '../types/auth'

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const supabase = getBrowserSupabase()

  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const validatedData = loginFormSchema.safeParse(rawFormData)

  if (!validatedData.success) {
    const errors = z.flattenError(validatedData.error).fieldErrors
    console.error(errors)

    return { success: false, errors }
  }

  const { error: supabaseError } = await supabase.auth.signInWithPassword({
    email: validatedData.data.email,
    password: validatedData.data.password
  })

  if (supabaseError) {
    console.error(supabaseError)

    return { success: false, errors: { supabaseError } }
  }

  console.log('Logged in')

  return { success: true, data: validatedData.data }
}

export async function signUp(
  state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const supabase = getBrowserSupabase()

  const rawFormData = {
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password')
  }

  const validatedData = signUpFormSchema.safeParse(rawFormData)

  if (!validatedData.success) {
    const errors = z.flattenError(validatedData.error).fieldErrors
    console.error(errors)

    return { success: false, errors }
  }

  const { error: supabaseError } = await supabase.auth.signUp({
    email: validatedData.data.email,
    password: validatedData.data.password
  })

  if (supabaseError) {
    console.error(supabaseError)

    return { success: false, errors: { supabaseError } }
  }

  console.log('Signed up in')

  return { success: true, data: validatedData.data }
}

export async function authWithGithub(): Promise<GithubSignInResult> {
  const supabase = getBrowserSupabase()

  let { error } = await supabase.auth.signInWithOAuth({
    provider: 'github'
  })

  if (error) {
    return { error, success: false }
  }
  console.log('Logged in with github')

  return { success: true }
}

export async function signOut(): Promise<SignOutResult> {
  const supabase = getBrowserSupabase()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error }
  }
  console.log('Logged out')

  return { success: true }
}
