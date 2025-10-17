import { CreateMapMarker } from '@/lib/types/api/leaflet'
import styles from './marker-form.module.css'

export default function MarkerForm({
  markerData
}: {
  markerData: CreateMapMarker
}) {
  return (
    <form className={styles.marker_form}>
      <label htmlFor="lat" className={styles.marker_label}>
        Latitude:
        <input
          className={styles.marker_input}
          type="text"
          id="lat"
          value={markerData.lat}
          disabled
        />
      </label>

      <label htmlFor="lng" className={styles.marker_label}>
        Longitude:
        <input
          className={styles.marker_input}
          type="text"
          id="lng"
          value={markerData.lng}
          disabled
        />
      </label>

      <label htmlFor="title" className={styles.marker_label}>
        Marker Title:
        <input className={styles.marker_input} type="text" id="title" />
      </label>

      <label htmlFor="desc" className={styles.marker_label}>
        Marker Description:
        <textarea id="desc"></textarea>
      </label>

      <label htmlFor="note" className={styles.marker_label}>
        Linked Note:
        <input className={styles.marker_input} type="text" id="note" />
      </label>
    </form>
  )
}
