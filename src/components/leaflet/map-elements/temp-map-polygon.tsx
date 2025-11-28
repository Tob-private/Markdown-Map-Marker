'use client'
import { Polygon } from '@/lib/types/leaflet'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from './map-elements.module.css'
import { Link as LucideLink } from 'lucide-react'
import type { LatLngExpression } from 'leaflet'

export const TempLeafletMapPolygon = dynamic(
  async () => {
    const RL = await import('react-leaflet')

    return function TempLeafletMapPolygon({ polygon }: { polygon: Polygon }) {
      const polygonCoords: LatLngExpression[] = polygon.positions
        .sort((a, b) => a.index - b.index)
        .map((p) => [p.lat, p.lng])

      return (
        <RL.Polygon positions={polygonCoords} pathOptions={polygon.options}>
          <RL.Popup>
            <div className={styles.popup_title_div}>
              {polygon.note_id ? (
                <Link
                  href={`/${polygon.note_id}`}
                  className={styles.popup_link}
                >
                  <h6 className={styles.popup_title}>{polygon.title}</h6>
                  <LucideLink color="var(--color-purple)" width={20} />
                </Link>
              ) : (
                <h6 className={styles.popup_title}>{polygon.title}</h6>
              )}
            </div>

            <p className={styles.popup_desc}>
              {polygon.desc.length > 100
                ? polygon.desc.substring(0, 100) + '...'
                : polygon.desc}
            </p>
          </RL.Popup>
        </RL.Polygon>
      )
    }
  },
  { ssr: false }
)
