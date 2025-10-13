export function createMarker(lat: number, lng: number) {
  // To convert them to numbers to avoid having to store floating points
  lat = Math.round(lat);
  lng = Math.round(lng);
  console.log(lat);
  console.log(lng);
}
