import { openMarkerForm, pushPolygonDetails } from '@/lib/leaflet/leaflet'
import { Polygon, PolygonCoords } from '@/lib/types/leaflet'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'

export default function LeafletMapEvents({
  useMapEvents,
  imgPath,
  markerFormToggle,
  setMarkerData,
  isCreatingPolygon,
  polygonCoords,
  setPolygonsCoords
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map
  imgPath: string
  markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
  isCreatingPolygon: boolean
  polygonCoords: PolygonCoords[]
  setPolygonsCoords: React.Dispatch<React.SetStateAction<PolygonCoords[]>>
}) {
  useMapEvents({
    // Create map marker
    dblclick: (e) =>
      isCreatingPolygon
        ? pushPolygonDetails(
            {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              img_path: imgPath
            },
            polygonCoords,
            setPolygonsCoords
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
