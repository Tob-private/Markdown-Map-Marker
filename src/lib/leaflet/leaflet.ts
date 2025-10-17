import z from 'zod'
import { createServerSupabaseFromCookies } from '../db/supabase/server'
import { CreateMapMarker } from '../types/api/leaflet'
import { MapMarker } from '../types/supabase'

export async function getMarkersFromImgPath(
  imgPath: string
): Promise<MapMarker[]> {
  const supabase = await createServerSupabaseFromCookies()
  const { data, error } = await supabase
    .from('map_markers')
    .select()
    .like('img_path', imgPath)

  if (error) {
    console.error(error)
    throw new Error('Error fetching markers from img path')
  } else {
    return data
  }
}

export async function openCreateMarkerForm(
  { lat, lng }: { lat: number; lng: number },
  imgPathName: string,
  markerFormToggle: (bool: boolean) => void,
  setMarkerData: (data: CreateMapMarker) => void
) {
  markerFormToggle(true)
  setMarkerData({ lat, lng, img_path: imgPathName })
}
