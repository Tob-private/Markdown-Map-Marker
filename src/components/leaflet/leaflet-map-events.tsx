import { openMarkerForm } from '@/lib/leaflet/leaflet'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'

export default function LeafletMapEvents({
  useMapEvents,
  imgPath,
  markerFormToggle,
  setMarkerData
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map
  imgPath: string
  markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
}) {
  useMapEvents({
    // Create map marker
    dblclick: (e) =>
      openMarkerForm(
        { lat: e.latlng.lat, lng: e.latlng.lng, img_path: imgPath },
        'insert',
        markerFormToggle,
        setMarkerData
      )
  })

  return null
}
