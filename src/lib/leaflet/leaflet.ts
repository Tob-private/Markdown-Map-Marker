import { createServerSupabaseFromCookies } from '../db/supabase/server'
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
  img_path: string,
  markerFormToggle: (bool: boolean) => void,
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
) {
  markerFormToggle(true)
  setMarkerData({ lat, lng, img_path })
}
