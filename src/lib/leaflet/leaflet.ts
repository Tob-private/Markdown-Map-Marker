import L, { type LatLngBounds } from "leaflet";

export async function generateMaps(
  mapImg: HTMLImageElement,
  dimensions: { width: number; height: number },
  imgId: string
) {
  if (typeof window === "undefined") return;

  // Prevent reinitialization
  const mapDiv = document.getElementById(imgId);
  if (!mapDiv) {
    throw new Error("Map container not found");
  }
  if (mapDiv.classList.contains("leaflet-container")) {
    return; // Map already initialized
  }

  let mapPath = mapImg.getAttribute("src");
  if (!mapPath) throw new Error("Map src not set");

  if (mapPath.startsWith("/public/")) {
    mapPath = mapPath.replace(/^\/public/, "");
  }

  // Remove original image from DOM
  mapImg.remove();

  // Create Leaflet map using CRS.Simple (image coordinates)
  const map = L.map(imgId, {
    crs: L.CRS.Simple,
    minZoom: -1,
    maxZoom: 4,
    zoomSnap: 0.1,
  });

  const { width: imageWidth, height: imageHeight } = dimensions;

  // Define bounds: top-left [0,0] to bottom-right [height, width]
  const bounds: LatLngBounds = L.latLngBounds([
    [0, 0],
    [imageHeight, imageWidth],
  ]);

  // Add image overlay to map
  L.imageOverlay(mapPath, bounds).addTo(map);

  // Fit map view to bounds
  map.fitBounds(bounds);

  // Optional: restrict panning outside the image
  map.setMaxBounds(bounds);
}
