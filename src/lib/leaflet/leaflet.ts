import L, { type LatLngBoundsLiteral } from "leaflet";

export async function generateMaps() {
  if (typeof window === "undefined") return;

  const mapDiv = document.getElementById("halrani.jpg");
  if (!mapDiv) {
    console.warn("Map container not found");
    return;
  }

  // Prevent reinitialization
  if (mapDiv.classList.contains("leaflet-container")) return;

  // Create the map with CRS.Simple for image coordinates
  const map = L.map(mapDiv, {
    crs: L.CRS.Simple,
    minZoom: -1, // allow zooming out
    maxZoom: 4,
    zoomSnap: 0.25,
  });

  // Define the image URL (adjust path if needed)
  const imageUrl = "Markdown Map Marker/assets/maps/halrani.jpg";

  // Define the image size in "map units" (pixel coordinates)
  // e.g. if halrani.jpg is 2000x1500 pixels
  const imageWidth = 2000;
  const imageHeight = 1500;

  // Define map bounds: top-left (0,0) to bottom-right (height, width)
  const bounds: LatLngBoundsLiteral = [
    [0, 0],
    [imageHeight, imageWidth],
  ];

  // Add the image overlay
  L.imageOverlay(imageUrl, bounds).addTo(map);

  // Fit map view to image bounds
  map.fitBounds(bounds);
}
