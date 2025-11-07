import { createServerSupabaseFromCookies } from '../db/supabase/server'
import { MapElementData, Polygon, PolygonCoords } from '../types/leaflet'
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
  markerData: MapElementData,
  type: 'insert' | 'update',
  markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void,
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
) {
  markerFormToggle(true, type)
  setMarkerData(markerData)
}

export async function pushPolygonDetails(
  polygonData: MapElementData,
  polygonCoords: PolygonCoords[],
  setPolygonsCoords: React.Dispatch<React.SetStateAction<PolygonCoords[]>>
) {
  const polygonCoordObj = {
    lat: polygonData.lat,
    lng: polygonData.lng,
    index: polygonCoords.length
  }
  console.log('polygon double click')
  console.log(polygonData)
  setPolygonsCoords([...polygonCoords, polygonCoordObj])
}
