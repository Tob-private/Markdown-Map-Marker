import z from 'zod'

export type MarkerFormState =
  | {
      success: true
      data: {
        lat: number
        lng: number
        title: string
        desc: string
        note_id?: string | null
      }
      path: string
    }
  | {
      success: false
      errors: {
        lat?: string[]
        lng?: string[]
        title?: string[]
        desc?: string[]
        note_id?: string[]
      }
      path: string
    }

export const markerFormSchema = z.object({
  lat: z.float64('Lat needs to be a float64').min(0, 'Lat is smaller than 0'),
  lng: z.float64('Lng needs to be a float64').min(0, 'Lng is smaller than 0'),
  title: z
    .string('Title needs to be a string')
    .min(3, 'Title needs to be at least 3 characters long'),
  desc: z
    .string('Desc needs to be a string')
    .min(10, 'Desc needs to be at least 10 characters long'),
  note_id: z.string('Note id link needs to be a string').optional()
})

export interface MapMarkerData {
  lat: number
  lng: number
  img_path: string
  title?: string
  desc?: string
  note_id?: string
  id?: string
}
