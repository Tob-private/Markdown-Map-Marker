import { getBrowserSupabase } from '../db/supabase/client'
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

export async function createMarker(
  lat: number,
  lng: number,
  imgPathName: string
) {
  const supabase = getBrowserSupabase()

  // To convert them to numbers to avoid having to store floating points
  lat = Math.round(lat)
  lng = Math.round(lng)

  const mapMarker: CreateMapMarker = {
    lat,
    lng,
    img_path: imgPathName
  }
  console.dir({ mapMarker })

  const { error } = await supabase
    .from('map_markers')
    .insert(mapMarker)
    .select()

  if (error !== null) {
    console.error(error)
  }
}
