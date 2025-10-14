"use server";
import { supabase } from "../db/supabase";
import { CreateMapMarker } from "../types/api/leaflet";

export async function createMarker(
  lat: number,
  lng: number,
  imgPathName: string
) {
  // To convert them to numbers to avoid having to store floating points
  lat = Math.round(lat);
  lng = Math.round(lng);

  const mapMarker: CreateMapMarker = {
    lat,
    lng,
    img_path: imgPathName,
  };
  console.dir({ mapMarker });

  const { data, error } = await supabase
    .from("map_markers")
    .insert(mapMarker)
    .select();

  if (error !== null) {
    console.error(error);
  }
}
