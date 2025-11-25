import { PolygonFormState } from '../types/leaflet'

interface BoundData {
  img_path: string
  id?: string
}

export async function createPolygon(
  { img_path }: BoundData,
  currentState: PolygonFormState,
  formData: FormData
): Promise<PolygonFormState> {}

export async function updatePolygon(
  { img_path, id }: BoundData,
  currentState: PolygonFormState,
  formData: FormData
): Promise<PolygonFormState> {}
