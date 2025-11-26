import { Polygon } from '@/lib/types/leaflet'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from './map-elements.module.css'
import { Link as LucideLink } from 'lucide-react'

export const LeafletMapPolygon = dynamic(
  async () => {
    const L = await import('leaflet')
    const RL = await import('react-leaflet')

    return function LeafletMapPolygon({ polygon }: { polygon: Polygon }) {
      const polygonCoords: L.LatLngExpression[] = polygon.positions
        .sort((a, b) => a.index - b.index)
        .map((p) => [p.lat, p.lng])

      return (
        <RL.Polygon positions={polygonCoords} pathOptions={polygon.options}>
          <RL.Popup>
            {polygon.note_id ? (
              <Link href={`/${polygon.note_id}`} className={styles.popup_link}>
                <h6 className={styles.popup_title}>{polygon.title}</h6>
                <LucideLink color="var(--color-purple)" width={20} />
              </Link>
            ) : (
              <h6 className={styles.popup_title}>{polygon.title}</h6>
            )}
          </RL.Popup>
        </RL.Polygon>
      )
    }
  },
  { ssr: false }
)
