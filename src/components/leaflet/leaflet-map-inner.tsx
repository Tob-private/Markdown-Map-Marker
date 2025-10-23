import dynamic from 'next/dynamic'
import LeafletMapEvents from './leaflet-map-events'
import { MapMarker } from '@/lib/types/supabase'
import styles from './leaflet-map-inner.module.css'
import Link from 'next/link'
import {
  EllipsisVertical,
  Link as LucideLink,
  SquarePen,
  Trash2
} from 'lucide-react'
import { openMarkerForm } from '@/lib/leaflet/leaflet'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export const LeafletMapInner = dynamic(
  async () => {
    const L = await import('leaflet')
    const { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } =
      await import('react-leaflet')

    const CRS = L.CRS.Simple
    // Return a functional component defined *inside* the dynamic import
    return function InnerMap({
      imageUrl,
      argBounds,
      argMaxBounds,
      mapMarkers,
      markerFormToggle,
      setMarkerData
    }: {
      imageUrl: string
      argBounds: number[][]
      argMaxBounds: number[][]
      mapMarkers: MapMarker[]
      markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
      setMarkerData: (dadata: {
        lat: number
        lng: number
        img_path: string
      }) => void
    }) {
      const [supabaseSession, setSupabaseSession] = useState<Session | null>()
      const supabase = getBrowserSupabase()

      const bounds = new L.LatLngBounds([
        [argBounds[0][0], argBounds[0][1]],
        [argBounds[1][0], argBounds[1][1]]
      ])
      const maxBounds = new L.LatLngBounds([
        [argMaxBounds[0][0], argMaxBounds[0][1]],
        [argMaxBounds[1][0], argMaxBounds[1][1]]
      ])

      useEffect(() => {
        supabase.auth.getSession().then((session) => {
          setSupabaseSession(session.data.session)
        })
      }, [supabase.auth])

      const handleDelete = async (id: string) => {
        const { data, error } = await supabase
          .from('map_markers')
          .delete()
          .eq('id', id)
          .select()
        if (error) {
          console.error(error)
        } else if (data.length === 0) {
          console.log('Item to delete wasnt found')
        } else {
          console.dir({ data }, { depth: null })
          console.log('id ' + id + ' has been deleted')
        }
      }

      return (
        <MapContainer
          crs={CRS}
          bounds={bounds}
          maxBounds={maxBounds}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          maxZoom={2}
          minZoom={-1}
          className="map"
          style={{ height: '600px', width: '100%' }}
        >
          {supabaseSession && (
            <LeafletMapEvents
              useMapEvents={useMapEvents}
              imgPath={imageUrl}
              markerFormToggle={markerFormToggle}
              setMarkerData={setMarkerData}
            />
          )}
          <ImageOverlay url={imageUrl} bounds={bounds} />
          {mapMarkers &&
            mapMarkers.map((marker) => (
              <Marker
                key={marker.id}
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
                <Popup className={styles.marker_popup}>
                  <div className={styles.marker_popup_title_div}>
                    {marker.note_id ? (
                      <Link
                        href={`/${marker.note_id}`}
                        className={styles.marker_popup_link}
                      >
                        <h6 className={styles.marker_popup_title}>
                          {marker.title}
                        </h6>
                        <LucideLink color="var(--color-purple)" width={20} />
                      </Link>
                    ) : (
                      <h6 className={styles.marker_popup_title}>
                        {marker.title}
                      </h6>
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
                                  note_id: marker.note_id
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
                            onClick={() => handleDelete(marker.id)}
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
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )
    }
  },
  { ssr: false }
)
