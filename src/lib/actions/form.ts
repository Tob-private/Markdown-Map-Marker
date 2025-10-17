'use server'
import { createServerSupabaseFromCookies } from '@/lib/db/supabase/server'
import { CreateMapMarker } from '@/lib/types/api/leaflet'
import { markerFormSchema, MarkerFormState } from '@/lib/types/leaflet'
import { revalidatePath } from 'next/cache'
import z from 'zod'

export async function createMarker(
  img_path: string,
  currentState: MarkerFormState,
  formData: FormData
): Promise<MarkerFormState> {
  const supabase = await createServerSupabaseFromCookies()
  const rawFormData = {
    lat: Number(formData.get('lat')),
    lng: Number(formData.get('lng')),
    title: formData.get('title'),
    desc: formData.get('desc'),
    note: formData.get('note')
  }
  const validationResult = markerFormSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    const errors = z.flattenError(validationResult.error).fieldErrors
    return { success: false, errors, path: currentState.path }
  }

  const decimals = 5

  const markerObj: CreateMapMarker = {
    lat:
      Math.round(validationResult.data.lat * 10 ** decimals) / 10 ** decimals,
    lng:
      Math.round(validationResult.data.lng * 10 ** decimals) / 10 ** decimals,
    img_path,
    title: validationResult.data.title,
    desc: validationResult.data.desc
  }

  const { data, error } = await supabase
    .from('map_markers')
    .insert(markerObj)
    .select()

  if (error) {
    console.error(error)
  } else {
    console.dir({ data })
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}
