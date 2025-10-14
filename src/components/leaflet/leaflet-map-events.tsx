import { createMarker } from "@/lib/leaflet/leaflet";
import { User } from "@supabase/supabase-js";
import { LeafletEventHandlerFnMap, Map } from "leaflet";

export default function LeafletMapEvents({
  useMapEvents,
  imgPath,
  user,
}: {
  useMapEvents: (handlers: LeafletEventHandlerFnMap) => Map;
  imgPath: string;
  user: User;
}) {
  const map = useMapEvents({
    click: (e) => createMarker(e.latlng.lat, e.latlng.lng, imgPath, user.id),
  });

  return null;
}
