'use client'
import { Polygon, PolygonFormState } from '@/lib/types/leaflet'
import styles from './polygon-form.module.css'
import { AutocompleteSearch } from './autocomplete-search'
import { MdFileLight } from '@/lib/types/supabase'
import { useActionState, useState } from 'react'
import { usePathname } from 'next/navigation'
import { createPolygon, updatePolygon } from '@/lib/actions/polygon-form'

export default function PolygonForm({
  polygonState,
  initialState = {
    success: true,
    data: {
      lat: [],
      lng: [],
      title: '',
      desc: ''
    },
    path: ''
  },
  mdFiles,
  formType,
  showFormToggle
}: {
  polygonState: Polygon
  initialState: PolygonFormState
  mdFiles: MdFileLight[]
  formType: 'insert' | 'update'
  showFormToggle: React.Dispatch<
    React.SetStateAction<{
      show: boolean
      type: 'insert' | 'update'
    }>
  >
}) {
  const [selectedFile, setSelectedFile] = useState<string>('')

  const pathName = usePathname()

  initialState.path = pathName

  const polygonAction = formType === 'insert' ? createPolygon : updatePolygon

  const polygonActionBoundData = polygonAction.bind(null, {
    img_path: polygonState.img_path,
    id: polygonState.id
  })

  const [, formAction] = useActionState<PolygonFormState, FormData>(
    polygonActionBoundData,
    initialState
  )

  const handleSubmit = () => {
    showFormToggle({ show: false, type: formType })
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <div className={styles.table_layout}>
        <table className={styles.polygon_coords}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {polygonState?.positions.map((pc, idx) => (
              <tr key={`tablecoords${idx}`}>
                <td>{idx}</td>
                <td className={styles.polygon_coords_cell}>
                  <label htmlFor={`lat${idx}`}>
                    <input
                      className={styles.polygon_coords_input}
                      type="text"
                      id={`lat${idx}`}
                      name={`lat`}
                      defaultValue={Number(pc.lat)}
                    />
                  </label>
                </td>
                <td className={styles.polygon_coords_cell}>
                  <label htmlFor={`lng${idx}`}>
                    <input
                      className={styles.polygon_coords_input}
                      type="text"
                      id={`lng${idx}`}
                      name={`lng`}
                      defaultValue={Number(pc.lng)}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <label htmlFor="title" className={styles.polygon_label}>
        Polygon Title:
        <input
          className={styles.polygon_input}
          type="text"
          id="title"
          name="title"
          defaultValue={initialState.success ? initialState.data.title : ''}
        />
      </label>

      <label htmlFor="desc" className={styles.polygon_label}>
        Polygon Description:
        <textarea
          id="desc"
          name="desc"
          className={styles.polygon_textarea}
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
        {formType === 'insert' ? 'Create' : 'Update'} Polygon
      </button>
    </form>
  )
}
