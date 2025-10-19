'use client'

import { useEffect, useState } from 'react'
import { LeafletMapInner } from './leaflet-map-inner'
import { getImageDimensions } from '@/lib/helpers/helpers'
import { MapMarker, MdFileLight } from '@/lib/types/supabase'
import MarkerForm from './marker-form'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { Session } from '@supabase/supabase-js'
import { MapMarkerData, MarkerFormState } from '@/lib/types/leaflet'

export default function LeafletMap({
  imgElement,
  mapMarkers,
  mdFiles
}: {
  imgElement: string
  mapMarkers: MapMarker[]
  mdFiles: MdFileLight[]
}) {
  const supabase = getBrowserSupabase()

  const [bounds, setBounds] = useState<number[][] | null>(null)
  const [maxBounds, setMaxBounds] = useState<number[][] | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [supabaseSession, setSupabaseSession] = useState<Session | null>()
  const [showMarkerForm, setShowMarkerForm] = useState<{
    show: boolean
    type: string
  }>({ show: false, type: '' })
  const [markerData, setMarkerData] = useState<MapMarkerData>()

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

  const handleShowMarkerForm = (bool: boolean, type: 'insert' | 'update') => {
    setShowMarkerForm({ show: bool, type })
  }

  const initialState: MarkerFormState = {
    success: true,
    data: {
      lat: markerData?.lat ?? 0,
      lng: markerData?.lng ?? 0,
      title: markerData?.title ?? '',
      desc: markerData?.desc ?? '',
      note_id: markerData?.note_id
    },
    path: ''
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
        <MarkerForm
          markerData={markerData}
          mdFiles={mdFiles}
          initialState={initialState}
          type={showMarkerForm.type}
        />
      )}
    </>
  )
}
