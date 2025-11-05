import { Polygon } from '@/lib/types/leaflet'
import dynamic from 'next/dynamic'

export const LeafletMapPolygon = dynamic(async () => {
  const L = await import('leaflet')
  const RL = await import('react-leaflet')
  return function LeafletMapPolygon({ polygon }: { polygon: Polygon }) {
    const polygonPositions = polygon.positions.map((positions) => {
      return { lat: positions.lat, lng: positions.lng }
    })
    return (
      <RL.Polygon
        pathOptions={{ color: 'purple' }}
        positions={polygonPositions}
      ></RL.Polygon>
    )
  }
})
