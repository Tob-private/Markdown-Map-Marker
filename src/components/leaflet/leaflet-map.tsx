'use client'

import { useEffect, useState } from 'react'
import { LeafletMapInner } from './leaflet-map-inner'
import { getImageDimensions } from '@/lib/helpers/helpers'
import { MapMarker } from '@/lib/types/supabase'

export default function LeafletMap({
  imgElement,
  mapMarkers
}: {
  imgElement: string
  mapMarkers: MapMarker[]
}) {
  const [bounds, setBounds] = useState<number[][] | null>(null)
  const [maxBounds, setMaxBounds] = useState<number[][] | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')

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
  }, [imgElement])

  if (!bounds || !imageUrl || !maxBounds) return <div>Loading map...</div>

  return (
    <LeafletMapInner
      imageUrl={imageUrl}
      argBounds={bounds}
      argMaxBounds={maxBounds}
      mapMarkers={mapMarkers}
    />
  )
}
