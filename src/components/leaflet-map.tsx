"use client";

import { useEffect } from "react";
import { generateMaps } from "@/lib/leaflet/leaflet";

export default function LeafletMap() {
  useEffect(() => {
    generateMaps();
  }, []);

  return <div></div>;
}
