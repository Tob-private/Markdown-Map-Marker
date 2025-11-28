import dynamic from 'next/dynamic'
import LeafletMapEvents from './leaflet-map-events'
import { MapMarker } from '@/lib/types/supabase'

import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { MapMarkerData, Polygon } from '@/lib/types/leaflet'
import { LeafletMapMarker } from './map-elements/map-marker'
import { LeafletMapPolygon } from './map-elements/map-polygon'
import { TempLeafletMapPolygon } from './map-elements/temp-map-polygon'

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
      showPolygonForm,
      setShowPolygonForm,
      polygons,
      polygonState,
      setPolygonState
    }: {
      imageUrl: string
      argBounds: number[][]
      argMaxBounds: number[][]
      mapMarkers: MapMarker[]
      markerFormToggle: (bool: boolean, type: 'insert' | 'update') => void
      setMarkerData: React.Dispatch<
        React.SetStateAction<MapMarkerData | undefined>
      >
      showPolygonForm: { show: boolean; type: 'insert' | 'update' }
      setShowPolygonForm: React.Dispatch<
        React.SetStateAction<{
          show: boolean
          type: 'insert' | 'update'
        }>
      >
      polygons: Polygon[]
      polygonState: Polygon | undefined
      setPolygonState: React.Dispatch<React.SetStateAction<Polygon | undefined>>
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
              showPolygonForm={showPolygonForm.show}
              polygonState={polygonState}
              setPolygonState={setPolygonState}
            />
          )}
          <RL.ImageOverlay url={imageUrl} bounds={bounds} />
          {mapMarkers &&
            mapMarkers.length > 0 &&
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
          {/* This is the polygon that is currently being created, aka generated from a state, not db */}
          {polygonState && polygonState.positions.length > 0 && (
            <TempLeafletMapPolygon polygon={polygonState} />
          )}

          {/* These are the polygons that are fetched from the database */}
          {polygons &&
            polygons.map((polygon) => (
              <LeafletMapPolygon
                key={polygon.id}
                polygon={polygon}
                supabaseSession={supabaseSession}
                setPolygonState={setPolygonState}
                setShowPolygonForm={setShowPolygonForm}
              />
            ))}
        </RL.MapContainer>
      )
    }
  },
  { ssr: false }
)
