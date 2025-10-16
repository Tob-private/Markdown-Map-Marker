import { createMarker } from '@/lib/leaflet/leaflet'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'

export default function LeafletMapEvents({
  useMapEvents,
  imgPath
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map
  imgPath: string
}) {
  useMapEvents({
    dblclick: (e) => createMarker(e.latlng.lat, e.latlng.lng, imgPath)
  })

  return null
}
