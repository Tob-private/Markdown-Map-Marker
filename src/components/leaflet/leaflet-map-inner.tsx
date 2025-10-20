import dynamic from 'next/dynamic'
import LeafletMapEvents from './leaflet-map-events'
import { MapMarker } from '@/lib/types/supabase'
import styles from './leaflet-map-inner.module.css'
import Link from 'next/link'
import { Link as LucideLink, SquarePen } from 'lucide-react'
import { openMarkerForm } from '@/lib/leaflet/leaflet'
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/db/supabase/client'

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
      }, [])

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
                    popupAnchor: [0, -45]
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
                      <SquarePen
                        width={20}
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
                    )}
                  </div>

                  <p className={styles.marker_popup_desc}>{marker.desc}</p>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      )
    }
  },
  { ssr: false }
)
