import type { PathOptions } from 'leaflet'
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

export interface MapElementData {
  lat: number
  lng: number
  img_path: string
}

export interface MapMarkerData {
  lat: number
  lng: number
  img_path: string
  title?: string
  desc?: string
  note_id?: string
  id?: string
}

export interface Polygon {
  id?: string
  options?: PathOptions
  note_id?: string
  title: string
  desc: string
  img_path: string
  positions: PolygonCoords[]
}

export interface PolygonCoords {
  index: number
  lat: number
  lng: number
}

export const polygonFormDataSchema = z.object({
  lat: z
    .array(
      z.float64('Lat needs to be a float64').min(0, 'Lat is smaller than 0')
    )
    .min(2),
  lng: z
    .array(
      z.float64('Lng needs to be a float64').min(0, 'Lng is smaller than 0')
    )
    .min(2),
  title: z
    .string('Title needs to be a string')
    .min(3, 'Title needs to be at least 3 characters long'),
  desc: z
    .string('Desc needs to be a string')
    .min(10, 'Desc needs to be at least 10 characters long'),
  note_id: z.string('Note id link needs to be a string').optional(),
  options: z.custom<PathOptions>().optional()
})

export type PolygonFormDataState = z.infer<typeof polygonFormDataSchema>

export const polygonFormSchema = z
  .object({
    success: z.literal(false),
    errors: z.object({
      id: z.array(z.string()).optional(),
      lat: z.array(z.string()).optional(),
      lng: z.array(z.string()).optional(),
      title: z.array(z.string()).optional(),
      desc: z.array(z.string()).optional(),
      note_id: z.array(z.string()).optional(),
      options: z.array(z.string()).optional()
    }),
    path: z.string()
  })
  .or(
    z.object({
      success: z.literal(true),
      data: z.object({
        lat: z.array(
          z.float64('Lat needs to be a float64').min(0, 'Lat is smaller than 0')
        ),
        lng: z.array(
          z.float64('Lng needs to be a float64').min(0, 'Lng is smaller than 0')
        ),
        title: z
          .string('Title needs to be a string')
          .min(3, 'Title needs to be at least 3 characters long'),
        desc: z
          .string('Desc needs to be a string')
          .min(10, 'Desc needs to be at least 10 characters long'),
        note_id: z.string('Note id link needs to be a string').optional(),
        options: z.custom<PathOptions>().optional()
      }),
      path: z.string()
    })
  )

export type PolygonFormState = z.infer<typeof polygonFormSchema>

export const polygonPayloadData = z
  .object({
    type: z.literal('create'),
    payload: z.object({
      title: z
        .string('Title needs to be a string')
        .min(3, 'Title needs to be at least 3 characters long'),
      desc: z
        .string('Desc needs to be a string')
        .min(10, 'Desc needs to be at least 10 characters long'),
      note_id: z
        .uuid('Note id link needs to be a string')
        .nullable()
        .optional(),
      options: z.custom<PathOptions>().optional(),
      img_path: z.string()
    })
  })
  .or(
    z.object({
      type: z.literal('update'),
      payload: z.object({
        id: z.string(),
        options: z.custom<PathOptions>().optional(),
        title: z
          .string('Title needs to be a string')
          .min(3, 'Title needs to be at least 3 characters long'),
        desc: z
          .string('Desc needs to be a string')
          .min(10, 'Desc needs to be at least 10 characters long'),
        note_id: z
          .string('Note id link needs to be a string')
          .nullable()
          .optional(),
        img_path: z.string()
      })
    })
  )
export type PolygonPayloadData = z.infer<typeof polygonPayloadData>
