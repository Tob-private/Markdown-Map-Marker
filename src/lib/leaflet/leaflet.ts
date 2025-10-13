import L from "leaflet";

export async function generateMaps(
  mapImg: HTMLImageElement,
  dimensions: { width: number; height: number },
  map: L.Map
) {
  let mapPath = mapImg.getAttribute("src");
  if (!mapPath) throw new Error("Map src not set");

  if (mapPath.startsWith("/public/")) {
    mapPath = mapPath.replace(/^\/public/, "");
  }

  // Remove original image from DOM
  mapImg.remove();

  const { width: imageWidth, height: imageHeight } = dimensions;

  // Define bounds: top-left [0,0] to bottom-right [height, width]
  const bounds: L.LatLngBounds = L.latLngBounds([
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

function createMarker() {
  const thing = "asdasd";
}
