'use client'

import { useEffect, useState } from 'react'
import { LeafletMapInner } from './leaflet-map-inner'
import { getImageDimensions } from '@/lib/helpers/helpers'
import { MapMarker } from '@/lib/types/supabase'
import MarkerForm from './marker-form'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { Session } from '@supabase/supabase-js'
import { CreateMapMarker } from '@/lib/types/api/leaflet'

export default function LeafletMap({
  imgElement,
  mapMarkers
}: {
  imgElement: string
  mapMarkers: MapMarker[]
}) {
  const supabase = getBrowserSupabase()

  const [bounds, setBounds] = useState<number[][] | null>(null)
  const [maxBounds, setMaxBounds] = useState<number[][] | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [supabaseSession, setSupabaseSession] = useState<Session | null>()
  const [showMarkerForm, setShowMarkerForm] = useState<boolean>(false)
  const [markerData, setMarkerData] = useState<CreateMapMarker>()

  useEffect(() => {
    const [, srcRight] = imgElement.split(`src="`)
    const [src] = srcRight.split(`"`)
    const url = `/${src}`
    setImageUrl(url)

    getImageDimensions(url)
      .then(({ width, height }) => {
        setBounds([
          [0, 0],
          [height, width]
        ])
        setMaxBounds([
          [-100, -100],
          [height + 100, width + 100]
        ])
      })
      .catch(console.error)

    supabase.auth.getSession().then((session) => {
      setSupabaseSession(session.data.session)
    })
  }, [imgElement, supabase.auth])

  if (!bounds || !imageUrl || !maxBounds) return <div>Loading map...</div>

  const handleShowMarkerForm = (bool: boolean) => {
    setShowMarkerForm(bool)
  }

  return (
    <>
      <LeafletMapInner
        imageUrl={imageUrl}
        argBounds={bounds}
        argMaxBounds={maxBounds}
        mapMarkers={mapMarkers}
        markerFormToggle={handleShowMarkerForm}
        setMarkerData={setMarkerData}
      />
      {supabaseSession && showMarkerForm && markerData && (
        <MarkerForm markerData={markerData} />
      )}
    </>
  )
}
