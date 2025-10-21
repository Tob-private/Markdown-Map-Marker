'use client'

import z from 'zod'
import { getBrowserSupabase } from '../db/supabase/client'
import { loginFormSchema, LoginFormState } from '../types/login'

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
