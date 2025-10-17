import dynamic from 'next/dynamic'
import LeafletMapEvents from './leaflet-map-events'
import { MapMarker } from '@/lib/types/supabase'
import styles from './leaflet-map-inner.module.css'
import Link from 'next/link'

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
      markerFormToggle: (bool: boolean) => void
      setMarkerData: (dadata: {
        lat: number
        lng: number
        img_path: string
      }) => void
    }) {
      const bounds = new L.LatLngBounds([
        [argBounds[0][0], argBounds[0][1]],
        [argBounds[1][0], argBounds[1][1]]
      ])
      const maxBounds = new L.LatLngBounds([
        [argMaxBounds[0][0], argMaxBounds[0][1]],
        [argMaxBounds[1][0], argMaxBounds[1][1]]
      ])

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
          <LeafletMapEvents
            useMapEvents={useMapEvents}
            imgPath={imageUrl}
            markerFormToggle={markerFormToggle}
            setMarkerData={setMarkerData}
          />
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
                  {marker.note_id ? (
                    <Link href={`/${marker.note_id}`}>
                      <h6 className={styles.marker_popup_title}>
                        {marker.title}
                      </h6>
                    </Link>
                  ) : (
                    <h6 className={styles.marker_popup_title}>
                      {marker.title}
                    </h6>
                  )}

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
