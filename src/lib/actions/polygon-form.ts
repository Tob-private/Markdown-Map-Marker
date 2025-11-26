'use server'
import z from 'zod'
import {
  PolygonCoords,
  polygonFormDataSchema,
  PolygonFormState,
  PolygonPayloadData
} from '../types/leaflet'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseFromCookies } from '../db/supabase/server'

interface BoundData {
  img_path: string
  id?: string
}

export async function createPolygon(
  { img_path }: BoundData,
  currentState: PolygonFormState,
  formData: FormData
): Promise<PolygonFormState> {
  const supabase = await createServerSupabaseFromCookies()

  const validationResult = getPolygonFormData(formData, currentState)
  if (validationResult.success == false) {
    return validationResult
  }

  const polygonObj: PolygonPayloadData = {
    type: 'create',
    payload: {
      title: validationResult.data.title,
      desc: validationResult.data.desc,
      note_id:
        validationResult.data.note_id !== ''
          ? validationResult.data.note_id
          : null,
      options: validationResult.data.options,
      img_path: img_path
    }
  }

  const { data: selectData, error: selectError } = await supabase
    .from('map_polygons')
    .select()

  if (selectError) {
    console.dir({ selectError })
    console.dir({ selectData })
    throw new Error('Error creating polygon entry in map_polygons')
  } else {
    // console.dir({ selectData })
  }

  const { data: polygonData, error: polygonError } = await supabase
    .from('map_polygons')
    .insert(polygonObj.payload)
    .select()

  if (polygonError) {
    console.dir({ polygonError })
    console.dir({ polygonData })
    throw new Error('Error creating polygon entry in map_polygons')
  } else {
    // console.dir({ polygonData })
  }

  const positions: PolygonCoords[] = []

  const decimals = 5

  for (let i = 0; i < validationResult.data.lat.length; i++) {
    const position: {
      index: number
      lat: number
      lng: number
      polygon_id: string
    } = {
      index: i,
      lat:
        Math.round(validationResult.data.lat[i] * 10 ** decimals) /
        10 ** decimals,
      lng:
        Math.round(validationResult.data.lng[i] * 10 ** decimals) /
        10 ** decimals,
      polygon_id: polygonData[0].id
    }
    positions.push(position)
  }

  const { data: coordsData, error: coordsError } = await supabase
    .from('polygon_positions')
    .insert(positions)
    .select()

  if (coordsError) {
    console.dir({ coordsError })
    throw new Error('Error creating polygon entry in map_polygons')
  } else {
    // console.dir({ coordsData })
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}

export async function updatePolygon(
  { img_path, id }: BoundData,
  currentState: PolygonFormState,
  formData: FormData
): Promise<PolygonFormState> {}

function getPolygonFormData(
  formData: FormData,
  currentState: PolygonFormState
): PolygonFormState {
  const rawFormData = {
    lat: formData.getAll('lat').map((l) => Number(l)),
    lng: formData.getAll('lng').map((l) => Number(l)),
    title: formData.get('title'),
    desc: formData.get('desc'),
    note_id: formData.get('note_id'),
    options: formData.get('options')
  }
  console.dir({ rawFormData })
  const validationResult = polygonFormDataSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    const errors = z.flattenError(validationResult.error).fieldErrors
    console.dir({ errors, data: validationResult.data }, { depth: null })
    return { success: false, errors, path: currentState.path }
  }
  return { success: true, data: validationResult.data, path: currentState.path }
}
