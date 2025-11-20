import { openMarkerForm, pushPolygonDetails } from '@/lib/leaflet/leaflet'
import { Polygon } from '@/lib/types/leaflet'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'

export default function LeafletMapEvents({
  useMapEvents,
  imgPath,
  markerFormToggle,
  setMarkerData,
  showPolygonForm,
  polygonState,
  setPolygonState
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map
  imgPath: string
  markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
  showPolygonForm: boolean
  polygonState: Polygon | undefined
  setPolygonState: React.Dispatch<React.SetStateAction<Polygon | undefined>>
}) {
  useMapEvents({
    // Create map marker
    dblclick: (e) =>
      showPolygonForm
        ? pushPolygonDetails(
            {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              img_path: imgPath
            },
            polygonState,
            setPolygonState
          )
        : openMarkerForm(
            { lat: e.latlng.lat, lng: e.latlng.lng, img_path: imgPath },
            'insert',
            markerFormToggle,
            setMarkerData
          )
  })

  return null
}
