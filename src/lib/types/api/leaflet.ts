export type MapMarkerForm =
  | {
      type: 'create'
      payload: {
        lat: number
        lng: number
        img_path: string
        title: string
        desc: string
        note_id?: string | null
      }
    }
  | {
      type: 'update'
      payload: {
        lat: number
        lng: number
        img_path: string
        title: string
        desc: string
        note_id?: string | null
        updated_at: Date
      }
    }
