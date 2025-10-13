import { createMarker } from "@/lib/leaflet/leaflet";
import { LeafletEventHandlerFnMap, Map } from "leaflet";

export default function LeafletMapEvents({
  useMapEvents,
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map;
}) {
  const map = useMapEvents({
    click: (e) => createMarker([e.latlng.lat, e.latlng.lng]),
  });

  return null;
}
