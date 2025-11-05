'use client'
import dynamic from 'next/dynamic'
import type { MapMarker } from '@/lib/types/supabase'
import styles from './map-marker.module.css'
import Link from 'next/link'
import {
  EllipsisVertical,
  Link as LucideLink,
  SquarePen,
  Trash2
} from 'lucide-react'
import { deleteMarker } from '@/lib/actions/marker-actions'
import { openMarkerForm } from '@/lib/leaflet/leaflet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@radix-ui/react-popover'
import { usePathname } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { MapMarkerData } from '@/lib/types/leaflet'

export const LeafletMapMarker = dynamic(
  async () => {
    const L = await import('leaflet')
    const RL = await import('react-leaflet')

    return function LeafletMapMarker({
      marker,
      supabaseSession,
      imageUrl,
      markerFormToggle,
      setMarkerData
    }: {
      marker: MapMarker
      supabaseSession: Session | null | undefined
      imageUrl: string
      markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
      setMarkerData: React.Dispatch<
        React.SetStateAction<MapMarkerData | undefined>
      >
    }) {
      const pathName = usePathname()

      return (
        <RL.Marker
          key={marker.id + marker.updated_at}
          position={[marker.lat, marker.lng]}
          icon={
            new L.Icon({
              iconUrl: 'marker-icon.png',
              iconSize: [40, 40],
              iconAnchor: [20, 20],
              popupAnchor: [0, -25]
            })
          }
        >
          <RL.Popup className={styles.marker_popup}>
            <div className={styles.marker_popup_title_div}>
              {marker.note_id ? (
                <Link
                  href={`/${marker.note_id}`}
                  className={styles.marker_popup_link}
                >
                  <h6 className={styles.marker_popup_title}>{marker.title}</h6>
                  <LucideLink color="var(--color-purple)" width={20} />
                </Link>
              ) : (
                <h6 className={styles.marker_popup_title}>{marker.title}</h6>
              )}
              {supabaseSession && (
                <Popover>
                  <PopoverTrigger asChild>
                    <EllipsisVertical />
                  </PopoverTrigger>
                  <PopoverContent
                    className={styles.marker_popup_actions}
                    side="top"
                  >
                    <SquarePen
                      width={20}
                      color="var(--color-purple)"
                      className={styles.marker_popup_edit}
                      onClick={() =>
                        openMarkerForm(
                          {
                            lat: marker.lat,
                            lng: marker.lng,
                            img_path: imageUrl,
                            title: marker.title,
                            desc: marker.desc,
                            note_id: marker.note_id,
                            id: marker.id
                          },
                          'update',
                          markerFormToggle,
                          setMarkerData
                        )
                      }
                    />
                    <Trash2
                      color="var(--color-red)"
                      width={20}
                      className={styles.marker_popup_delete}
                      onClick={() => deleteMarker(marker.id, pathName)}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <p className={styles.marker_popup_desc}>
              {marker.desc.length > 100
                ? marker.desc.substring(0, 100) + '...'
                : marker.desc}
            </p>
          </RL.Popup>
        </RL.Marker>
      )
    }
  },
  { ssr: false }
)
