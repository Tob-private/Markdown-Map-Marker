'use client'

import { useEffect, useState } from 'react'
import { LeafletMapInner } from './leaflet-map-inner'
import { getImageDimensions } from '@/lib/helpers/helpers'
import { MapMarker, MdFileLight } from '@/lib/types/supabase'
import { getBrowserSupabase } from '@/lib/db/supabase/client'
import { Session } from '@supabase/supabase-js'
import {
  MapMarkerData,
  MarkerFormState,
  Polygon,
  PolygonFormState
} from '@/lib/types/leaflet'
import MarkerForm from './forms/marker-form'
import PolygonForm from './forms/polygon-form'

export default function LeafletMap({
  imgElement,
  mapMarkers,
  mapPolygons,
  mdFiles
}: {
  imgElement: string
  mapMarkers: MapMarker[]
  mapPolygons: Polygon[]
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
  const [showPolygonForm, setShowPolygonForm] = useState<{
    show: boolean
    type: 'insert' | 'update'
  }>({ show: false, type: 'insert' })
  const [markerData, setMarkerData] = useState<MapMarkerData>()
  const [polygonState, setPolygonState] = useState<Polygon>()
  const [polygons, setPolygons] = useState<Polygon[]>([])

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

  useEffect(() => {
    console.log(mapPolygons)

    setPolygons(mapPolygons)
  }, [mapPolygons])

  if (!bounds || !imageUrl || !maxBounds) return <div>Loading map...</div>

  const handleShowMarkerForm = (bool: boolean, type: 'insert' | 'update') => {
    setShowMarkerForm({ show: bool, type })
  }

  const handleTogglePolygonCreation = () => {
    setShowPolygonForm((prev) => {
      const newVal = { show: !prev.show, type: prev.type }
      if (newVal) {
        setMarkerData(undefined)

        if (!polygonState) {
          const boilerPlatePolygonData: Polygon = {
            title: 'Testing',
            desc: 'This is a new polygon',
            img_path: imageUrl,
            positions: []
          }
          setPolygonState(boilerPlatePolygonData)
        }
      }
      return newVal
    })
  }

  const initialMarkerFormState: MarkerFormState = {
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
  const initialPolygonFormState: PolygonFormState = {
    success: true,
    data: {
      lat: polygonState?.positions.map((coord) => coord.lat) ?? [],
      lng: polygonState?.positions.map((coord) => coord.lng) ?? [],
      title: polygonState?.title ?? '',
      desc: polygonState?.desc ?? '',
      note_id: polygonState?.note_id,
      options: polygonState?.options
    },
    path: ''
  }

  return (
    <>
      <button onClick={handleTogglePolygonCreation}>
        Toggle polygon creation tool
      </button>
      <LeafletMapInner
        imageUrl={imageUrl}
        argBounds={bounds}
        argMaxBounds={maxBounds}
        mapMarkers={mapMarkers}
        markerFormToggle={handleShowMarkerForm}
        setMarkerData={setMarkerData}
        showPolygonForm={showPolygonForm}
        polygons={polygons}
        polygonState={polygonState}
        setPolygonState={setPolygonState}
      />
      {supabaseSession && showMarkerForm.show && markerData ? (
        <MarkerForm
          markerData={markerData}
          mdFiles={mdFiles}
          initialState={initialMarkerFormState}
          type={showMarkerForm.type}
          showFormToggle={setShowMarkerForm}
        />
      ) : (
        supabaseSession &&
        showPolygonForm.show &&
        polygonState && (
          <PolygonForm
            polygonState={polygonState}
            initialState={initialPolygonFormState}
            mdFiles={mdFiles}
            formType={showPolygonForm.type}
            showFormToggle={setShowPolygonForm}
          />
        )
      )}
    </>
  )
}
