'use server'
import { markerFormSchema, MarkerFormState } from '@/lib/types/leaflet'
import z from 'zod'

export async function createMarker(
  currentState: MarkerFormState,
  formData: FormData
): Promise<MarkerFormState> {
  'use server'
  const rawFormData = {
    lat: Number(formData.get('lat')),
    lng: Number(formData.get('lng')),
    title: formData.get('title'),
    desc: formData.get('desc'),
    note: formData.get('note')
  }
  console.dir({ rawFormData })
  const validationResult = markerFormSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    const errors = z.flattenError(validationResult.error).fieldErrors
    return { success: false, errors }
  }

  return { data: validationResult.data, success: true }
}
