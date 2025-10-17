import { openCreateMarkerForm } from '@/lib/leaflet/leaflet'
import { LeafletEventHandlerFnMap, Map } from 'leaflet'

export default function LeafletMapEvents({
  useMapEvents,
  imgPath,
  markerFormToggle,
  setMarkerData
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map
  imgPath: string
  markerFormToggle: (bool: boolean) => void
  setMarkerData: (data: { lat: number; lng: number; img_path: string }) => void
}) {
  useMapEvents({
    dblclick: (e) =>
      openCreateMarkerForm(e.latlng, imgPath, markerFormToggle, setMarkerData)
  })

  return null
}
