'use client'
import { Polygon } from '@/lib/types/leaflet'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from './map-elements.module.css'
import {
  EllipsisVertical,
  Link as LucideLink,
  SquarePen,
  Trash2
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Session } from '@supabase/supabase-js'

export const LeafletMapPolygon = dynamic(
  async () => {
    const L = await import('leaflet')
    const RL = await import('react-leaflet')

    return function LeafletMapPolygon({
      polygon,
      supabaseSession
    }: {
      polygon: Polygon
      supabaseSession: Session | null | undefined
    }) {
      const polygonCoords: L.LatLngExpression[] = polygon.positions
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
              {supabaseSession && (
                <Popover>
                  <PopoverTrigger asChild>
                    <EllipsisVertical />
                  </PopoverTrigger>
                  <PopoverContent className={styles.popup_actions} side="top">
                    <SquarePen
                      width={20}
                      color="var(--color-purple)"
                      className={styles.popup_edit}
                      onClick={() => console.log('update')} // Open polygon form
                    />
                    <Trash2
                      color="var(--color-red)"
                      width={20}
                      className={styles.popup_delete}
                      onClick={() => console.log('delete')} // Run delete action
                    />
                  </PopoverContent>
                </Popover>
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
