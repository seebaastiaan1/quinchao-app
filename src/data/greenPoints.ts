import datosQuinchao from '../../assets/data/datos_quinchao.json';
import { isValidCoordinate } from './availability';

// Puntos verdes (reciclaje) exportados del mapa municipal en GeoJSON (assets/data/datos_quinchao.json).
// Se muestran en el mapa como capa aparte cuando el filtro es "Todo" o "Reciclaje".
export interface GreenPoint {
  id: string;
  name: string;
  materials: string | null; // materiales que recibe, uno por línea
  lat: number;
  lng: number;
}

interface Feature {
  geometry: { type: string; coordinates: unknown };
  properties?: { name?: unknown; description?: unknown } | null;
}

// Marcas de trabajo del archivo original ("punto verde 3 ok", "punto verde 13 extra") que duplican puntos numerados
const DRAFT_NAME = /\b(ok|extra)\s*$/i;

function materialsOf(description: unknown): string | null {
  const raw =
    typeof description === 'string'
      ? description
      : typeof description === 'object' && description !== null && 'value' in description
        ? (description as { value: unknown }).value
        : null;
  if (typeof raw !== 'string') return null;
  const text = raw
    .replace(/<br\s*\/?>|<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .split('\n')
    .map((line) => line.trim().replace(/,$/, ''))
    .filter(Boolean)
    .join('\n');
  return text || null;
}

export const greenPoints: GreenPoint[] = (datosQuinchao.features as Feature[]).flatMap((feature, index) => {
  if (feature.geometry.type !== 'Point' || !Array.isArray(feature.geometry.coordinates)) return [];
  const [lng, lat] = feature.geometry.coordinates as unknown[];
  const name = typeof feature.properties?.name === 'string' ? feature.properties.name.trim() : '';
  if (!name || DRAFT_NAME.test(name) || !isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) return [];
  return [{ id: `punto-verde-${index}`, name, materials: materialsOf(feature.properties?.description), lat, lng }];
});
