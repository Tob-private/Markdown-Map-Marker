import dynamic from 'next/dynamic'
import LeafletMapEvents from './leaflet-map-events'
import { MapMarker } from '@/lib/types/supabase'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { MapMarkerData, Polygon } from '@/lib/types/leaflet'
import { LeafletMapMarker } from './map-elements/map-marker'

export const LeafletMapInner = dynamic(
  async () => {
    const L = await import('leaflet')
    const RL = await import('react-leaflet')

    // Return a functional component defined *inside* the dynamic import
    return function InnerMap({
      imageUrl,
      argBounds,
      argMaxBounds,
      mapMarkers,
      markerFormToggle,
      setMarkerData,
      polygons,
      setPolygons
    }: {
      imageUrl: string
      argBounds: number[][]
      argMaxBounds: number[][]
      mapMarkers: MapMarker[]
      markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
      setMarkerData: React.Dispatch<
        React.SetStateAction<MapMarkerData | undefined>
      >
      polygons: Polygon[]
      setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>
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

      return (
        <RL.MapContainer
          crs={L.CRS.Simple}
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
              useMapEvents={RL.useMapEvents}
              imgPath={imageUrl}
              markerFormToggle={markerFormToggle}
              setMarkerData={setMarkerData}
            />
          )}
          <RL.ImageOverlay url={imageUrl} bounds={bounds} />
          {mapMarkers &&
            mapMarkers.map((marker, index) => (
              <LeafletMapMarker
                key={index}
                marker={marker}
                supabaseSession={supabaseSession}
                imageUrl={imageUrl}
                markerFormToggle={markerFormToggle}
                setMarkerData={setMarkerData}
              />
            ))}
        </RL.MapContainer>
      )
    }
  },
  { ssr: false }
)
