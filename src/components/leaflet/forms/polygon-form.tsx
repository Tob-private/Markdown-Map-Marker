import { PolygonCoords } from '@/lib/types/leaflet'
import styles from './polygon-form.module.css'

export default function PolygonForm({
  polygonCoords
}: {
  polygonCoords: PolygonCoords[]
}) {
  return (
    <form action="">
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
            {polygonCoords.map((pc, idx) => (
              <tr key={`tablecoords${idx}`}>
                <td>{idx}</td>
                <td className={styles.polygon_coords_cell}>
                  <label htmlFor={`lat${idx}`}>
                    <input
                      className={styles.polygon_coords_input}
                      type="text"
                      id={`lat${idx}`}
                      name={`lat${idx}`}
                      defaultValue={Number(pc.lat)}
                    />
                  </label>
                </td>
                <td>
                  <label htmlFor={`lng${idx}`}>
                    <input
                      className={styles.polygon_coords_input}
                      type="text"
                      id={`lng${idx}`}
                      name={`lng${idx}`}
                      defaultValue={Number(pc.lng)}
                    />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  )
}
