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

  const { data: polygonData, error: polygonError } = await supabase
    .from('map_polygons')
    .insert(polygonObj.payload)
    .select()

  if (polygonError) {
    console.dir({ polygonError })
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

  const { error: coordsError } = await supabase
    .from('polygon_positions')
    .insert(positions)
    .select()

  if (coordsError) {
    console.dir({ coordsError })
    throw new Error('Error creating polygon entry in map_polygons')
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}

export async function updatePolygon(
  { img_path, id }: BoundData,
  currentState: PolygonFormState,
  formData: FormData
): Promise<PolygonFormState> {
  if (!id) {
    return {
      success: false,
      errors: { id: ['Id is undefined'] },
      path: img_path
    }
  }

  const supabase = await createServerSupabaseFromCookies()

  const validationResult = getPolygonFormData(formData, currentState)
  if (validationResult.success == false) {
    return validationResult
  }

  const polygonObj: PolygonPayloadData = {
    type: 'update',
    payload: {
      id: id,
      title: validationResult.data.title,
      desc: validationResult.data.desc,
      img_path: img_path,
      options: validationResult.data.options,
      note_id:
        validationResult.data.note_id !== ''
          ? validationResult.data.note_id
          : null
    }
  }

  const { data: polygonData, error: polygonError } = await supabase
    .from('map_polygons')
    .update(polygonObj.payload)
    .eq('id', polygonObj.payload.id)
    .select()

  if (polygonError) {
    console.dir({ polygonError })
    throw new Error('Error creating polygon entry in map_polygons')
  } else {
    // console.dir({ polygonData })
  }

  const { data: supabasePositions, error: supabasePositionsError } =
    await supabase
      .from('polygon_positions')
      .select('id')
      .eq('polygon_id', polygonObj.payload.id)

  if (supabasePositionsError) {
    console.dir({ supabasePositionsError })
    throw new Error('Error selecting polygon positions in polygon_positions')
  }

  const decimals = 5

  for (let i = 0; i < validationResult.data.lat.length; i++) {
    const position: {
      id: string
      index: number
      lat: number
      lng: number
      polygon_id: string
    } = {
      id: supabasePositions[i] ? supabasePositions[i].id : undefined,
      index: i,
      lat:
        Math.round(validationResult.data.lat[i] * 10 ** decimals) /
        10 ** decimals,
      lng:
        Math.round(validationResult.data.lng[i] * 10 ** decimals) /
        10 ** decimals,
      polygon_id: polygonData[0].id
    }
    if (position.id) {
      const { error: coordsError } = await supabase
        .from('polygon_positions')
        .update(position)
        .eq('id', position.id)

      if (coordsError) {
        console.dir({ coordsError })
        throw new Error('Error update position entry in polygon_position')
      }
    } else {
      const { error: coordsError } = await supabase
        .from('polygon_positions')
        .insert(position)

      if (coordsError) {
        console.dir({ coordsError })
        throw new Error('Error creating polygon entry in polygon_position')
      }
    }
  }

  revalidatePath(currentState.path)

  return { data: validationResult.data, success: true, path: currentState.path }
}

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
  const validationResult = polygonFormDataSchema.safeParse(rawFormData)

  if (!validationResult.success) {
    const errors = z.flattenError(validationResult.error).fieldErrors
    console.dir({ errors, data: validationResult.data }, { depth: null })
    return { success: false, errors, path: currentState.path }
  }
  return { success: true, data: validationResult.data, path: currentState.path }
}
