import { createServerSupabaseFromCookies } from '../db/supabase/server'
import { MapMarkerData } from '../types/leaflet'
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

export async function openMarkerForm(
  markerData: MapMarkerData,
  type: 'insert' | 'update',
  markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void,
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
) {
  markerFormToggle(true, type)
  setMarkerData(markerData)
}
