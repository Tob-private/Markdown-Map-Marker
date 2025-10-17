'use client'
import styles from './marker-form.module.css'
import { useActionState } from 'react'
import { MarkerFormState } from '@/lib/types/leaflet'
import { createMarker } from '@/lib/actions/form'

const initialState: MarkerFormState = {
  success: true,
  data: { lat: 0, lng: 0, title: '', desc: '', note: '' }
}

export default function MarkerForm({
  markerData
}: {
  markerData: {
    lat: number
    lng: number
    img_path: string
  }
}) {
  const createMarkerWithImgPath = createMarker.bind(null, markerData.img_path)

  const [, formAction] = useActionState<MarkerFormState, FormData>(
    createMarkerWithImgPath,
    initialState
  )

  return (
    <form className={styles.marker_form} action={formAction}>
      <label htmlFor="lat" className={styles.marker_label}>
        Latitude:
        <input
          className={styles.marker_input}
          type="text"
          readOnly
          id="lat"
          name="lat"
          value={Number(markerData.lat)}
        />
      </label>

      <label htmlFor="lng" className={styles.marker_label}>
        Longitude:
        <input
          className={styles.marker_input}
          type="text"
          readOnly
          id="lng"
          name="lng"
          value={Number(markerData.lng)}
        />
      </label>

      <label htmlFor="title" className={styles.marker_label}>
        Marker Title:
        <input
          className={styles.marker_input}
          type="text"
          id="title"
          name="title"
        />
      </label>

      <label htmlFor="desc" className={styles.marker_label}>
        Marker Description:
        <textarea id="desc" name="desc"></textarea>
      </label>

      <label htmlFor="note" className={styles.marker_label}>
        Linked Note:
        <input
          className={styles.marker_input}
          type="text"
          id="note"
          name="note"
        />
      </label>

      <button type="submit">Create Marker</button>
    </form>
  )
}
