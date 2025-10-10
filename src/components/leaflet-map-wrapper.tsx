"use client";

import { useEffect, useState } from "react";
import LeafletMap from "./leaflet-map";

export default function LeafletMapWrapper({
  imgElement,
}: {
  imgElement: HTMLImageElement;
}) {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imgSrc = imgElement.getAttribute("src");
  if (!imgSrc) throw new Error("Img src not set");

  useEffect(() => {
    const img = new Image();
    img.onload = () => setDimensions({ width: img.width, height: img.height });
    img.src = imgSrc;
  }, [imgSrc]);

  if (!dimensions) return null;

  return <LeafletMap imgElement={imgElement} dimensions={dimensions} />;
}
