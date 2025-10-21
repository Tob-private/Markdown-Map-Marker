'use client'
import styles from './marker-form.module.css'
import { useActionState, useState } from 'react'
import { MapMarkerData, MarkerFormState } from '@/lib/types/leaflet'
import { createMarker, updateMarker } from '@/lib/actions/form'
import { usePathname } from 'next/navigation'
import { AutocompleteSearch } from './autocomplete-search'
import { MdFileLight } from '@/lib/types/supabase'

export default function MarkerForm({
  mdFiles,
  markerData,
  initialState = {
    success: true,
    data: {
      lat: 0,
      lng: 0,
      title: '',
      desc: ''
    },
    path: ''
  },
  type,
  showFormToggle
}: {
  mdFiles: MdFileLight[]
  markerData: MapMarkerData
  initialState: MarkerFormState
  type: string
  showFormToggle: React.Dispatch<
    React.SetStateAction<{
      show: boolean
      type: string
    }>
  >
}) {
  const [selectedFile, setSelectedFile] = useState<string>('')
  const pathName = usePathname()

  initialState.path = pathName

  const markerFormAction = type === 'insert' ? createMarker : updateMarker

  const createMarkerWithImgPath = markerFormAction.bind(
    null,
    markerData.img_path
  )

  const [, formAction] = useActionState<MarkerFormState, FormData>(
    createMarkerWithImgPath,
    initialState
  )

  const handleSubmit = () => {
    showFormToggle({ show: false, type })
  }

  return (
    <form
      className={styles.marker_form}
      action={formAction}
      onSubmit={handleSubmit}
    >
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
          defaultValue={initialState.success ? initialState.data.title : ''}
        />
      </label>

      <label htmlFor="desc" className={styles.marker_label}>
        Marker Description:
        <textarea
          id="desc"
          name="desc"
          className={styles.marker_textarea}
          defaultValue={initialState.success ? initialState.data.desc : ''}
        ></textarea>
      </label>

      <label htmlFor="md-file" className={styles.label}>
        Select Markdown File
      </label>
      <AutocompleteSearch
        options={mdFiles}
        value={selectedFile}
        onChange={setSelectedFile}
        placeholder="Search files..."
        name="note_id"
      />

      <button type="submit">
        {type === 'insert' ? 'Create' : 'Update'} Marker
      </button>
    </form>
  )
}
