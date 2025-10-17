import z from 'zod'

export type MarkerFormState =
  | {
      success: true
      data: {
        lat: number
        lng: number
        title: string
        desc: string
        note: string
      }
    }
  | {
      success: false
      errors: {
        lat?: string[]
        lng?: string[]
        title?: string[]
        desc?: string[]
        note?: string[]
      }
    }

export const markerFormSchema = z.object({
  lat: z.number('Lat needs to be a number').min(0, 'Lat is smaller than 0'),
  lng: z.number('Lng needs to be a number').min(0, 'Lng is smaller than 0'),
  title: z
    .string('Title needs to be a string')
    .min(3, 'Title needs to be at least 3 characters long'),
  desc: z
    .string('Desc needs to be a string')
    .min(10, 'Desc needs to be at least 10 characters long'),
  note: z.string('Note link needs to be a string')
})
