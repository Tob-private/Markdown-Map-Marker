import { createServerSupabaseFromCookies } from '../db/supabase/server'
import { MapElementData, MapMarkerData, Polygon } from '../types/leaflet'
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

export async function pushPolygonDetails(
  polygonData: MapElementData,
  polygonState: Polygon | undefined,
  setPolygonState: React.Dispatch<React.SetStateAction<Polygon | undefined>>
) {
  if (polygonState) {
    const decimals = 5
    const polygonCoordObj = {
      lat: Math.round(polygonData.lat * 10 ** decimals) / 10 ** decimals,
      lng: Math.round(polygonData.lng * 10 ** decimals) / 10 ** decimals,
      index: polygonState.positions.length
    }
    const newPolygon: Polygon = {
      title: polygonState.title,
      desc: polygonState.desc,
      note_id: polygonState.note_id,
      options: polygonState.options,
      positions: [...polygonState.positions, polygonCoordObj]
    }
    setPolygonState(newPolygon)
  }
  console.log(polygonState)
}
