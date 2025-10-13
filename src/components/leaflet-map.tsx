"use client";
import { generateMaps } from "@/lib/leaflet/leaflet";
import { useEffect } from "react";
import L from "leaflet";

export default function LeafletMap({
  imgElement,
  dimensions,
}: {
  imgElement: HTMLImageElement;
  dimensions: { width: number; height: number };
}) {
  const mapId = imgElement.id || `map-${Math.random().toString(36).slice(2)}`;

  useEffect(() => {
    // Remove the original image from the DOM
    imgElement.remove();

    // Create Leaflet map using CRS.Simple (image coordinates)
    // if (typeof window === undefined) return;
    // Prevent reinitialization
    const mapDiv = document.getElementById(mapId);
    if (mapDiv && mapDiv.classList.contains("leaflet-container")) {
      return; // Map already initialized
    }

    const map = L.map(mapId, {
      crs: L.CRS.Simple,
      minZoom: -1,
      maxZoom: 2,
      zoomSnap: 0.1,
    });

    generateMaps(imgElement, dimensions, map);
  }, [imgElement, dimensions, mapId]);

  return <div id={mapId} className="map" />;
}
