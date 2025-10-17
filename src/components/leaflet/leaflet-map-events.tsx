import { openCreateMarkerForm } from '@/lib/leaflet/leaflet'
import { CreateMapMarker } from '@/lib/types/api/leaflet'
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
  setMarkerData: (data: CreateMapMarker) => void
}) {
  useMapEvents({
    dblclick: (e) =>
      openCreateMarkerForm(e.latlng, imgPath, markerFormToggle, setMarkerData)
  })

  return null
}
