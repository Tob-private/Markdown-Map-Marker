"use client";

import { useEffect, useState } from "react";
import LeafletMapWrapper from "./leaflet-map-wrapper";

export default function LeafletMapGenerator() {
  const [mapImgs, setMapImgs] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const imgs = Array.from(document.querySelectorAll(".map"));

    setMapImgs(imgs as HTMLImageElement[]);
  }, []);

  return (
    <>
      {mapImgs.map((img, idx) => (
        <LeafletMapWrapper key={idx} imgElement={img} />
      ))}
    </>
  );
}
