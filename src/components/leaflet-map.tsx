"use client";
import { generateMaps } from "@/lib/leaflet/leaflet";
import { useEffect } from "react";

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

    generateMaps(imgElement, dimensions, mapId);
  }, [imgElement, dimensions, mapId]);

  return <div id={mapId} className="map" />;
}
