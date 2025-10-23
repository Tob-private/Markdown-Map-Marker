'use server'
import { createServerSupabaseFromCookies } from '@/lib/db/supabase/server'
import { MapMarkerForm } from '@/lib/types/api/leaflet'
import { markerFormSchema, MarkerFormState } from '@/lib/types/leaflet'
import { revalidatePath } from 'next/cache'
import z from 'zod'

interface BoundData {
  img_path: string
  id?: string
}

export async function createMarker(
  { img_path }: BoundData,
  currentState: MarkerFormState,
  formData: FormData
): Promise<MarkerFormState> {
  const supabase = await createServerSupabaseFromCookies()

  const validationResult = getMarkerFormData(formData, currentState)
  if (validationResult.success == false) {
    return validationResult
  }

  const decimals = 5

  const markerObj: MapMarkerForm = {
    type: 'create',
    payload: {
      lat:
        Math.round(validationResult.data.lat * 10 ** decimals) / 10 ** decimals,
      lng:
        Math.round(validationResult.data.lng * 10 ** decimals) / 10 ** decimals,
      img_path,
      title: validationResult.data.title,
      desc: validationResult.data.desc,
      note_id:
        validationResult.data.note_id !== ''
          ? validationResult.data.note_id
          : null
    }
  }

  const { data, error } = await supabase
    .from('map_markers')
    .insert(markerObj.payload)
    .select()

  if (error) {
    console.dir({ error })
  } else {
    console.dir({ data })
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}

export async function updateMarker(
  { img_path, id }: BoundData,
  currentState: MarkerFormState,
  formData: FormData
): Promise<MarkerFormState> {
  const supabase = await createServerSupabaseFromCookies()

  const validationResult = getMarkerFormData(formData, currentState)
  if (validationResult.success == false) {
    return validationResult
  }

  const decimals = 5

  const markerObj: MapMarkerForm = {
    type: 'update',
    payload: {
      lat:
        Math.round(validationResult.data.lat * 10 ** decimals) / 10 ** decimals,
      lng:
        Math.round(validationResult.data.lng * 10 ** decimals) / 10 ** decimals,
      img_path,
      title: validationResult.data.title,
      desc: validationResult.data.desc,
      note_id:
        validationResult.data.note_id !== ''
          ? validationResult.data.note_id
          : null,
      updated_at: new Date()
    }
  }

  const { data, error } = await supabase
    .from('map_markers')
    .update(markerObj.payload)
    .eq('id', id)
    .select()

  if (error) {
    console.error(error)
  } else {
    console.dir({ data })
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}

function getMarkerFormData(
  formData: FormData,
  currentState: MarkerFormState
): MarkerFormState {
  const rawFormData = {
    lat: Number(formData.get('lat')),
    lng: Number(formData.get('lng')),
    title: formData.get('title'),
    desc: formData.get('desc'),
    note_id: formData.get('note_id')
  }
  const validationResult = markerFormSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    const errors = z.flattenError(validationResult.error).fieldErrors
    console.dir({ errors, data: validationResult.data }, { depth: null })
    return { success: false, errors, path: currentState.path }
  }
  return { success: true, data: validationResult.data, path: currentState.path }
}
