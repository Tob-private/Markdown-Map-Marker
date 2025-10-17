export interface MdFile {
  id: string
  created_at: string
  updated_at: string
  filename: string
  md_path: string
}
export interface MdFileLight {
  id: string
  filename: string
}

export interface MapMarker {
  id: string
  createt_at: string
  updated_at: string
  lat: number
  lng: number
  imgPathname: string
  title: string
  desc: string
  note_id?: string
}
