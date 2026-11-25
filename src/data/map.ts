import type { CategoryKey, Place } from './types';
import { hasValidLocation } from './availability';

// Lógica del mapa compartida entre map.tsx (WebView) y map.web.tsx (Leaflet).
export type CategoryFilter = CategoryKey | 'todo';

export interface Bounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

// Centro aproximado de la isla Quinchao (vista inicial)
export const ISLAND_CENTER = { lat: -42.45, lng: -73.47 };

export const filterByCategory = (list: Place[], category: CategoryFilter): Place[] =>
  (category === 'todo' ? list : list.filter((p) => p.category === category)).filter(hasValidLocation);
export const filterBySector = (list: Place[], sector: string | null): Place[] =>
  (sector ? list.filter((p) => p.area === sector) : list).filter(hasValidLocation);

export function boundsOf(list: Place[]): Bounds | null {
  const valid = list.filter(hasValidLocation);
  if (valid.length === 0) return null;
  const lats = valid.map((p) => p.lat);
  const lngs = valid.map((p) => p.lng);
  return { south: Math.min(...lats), west: Math.min(...lngs), north: Math.max(...lats), east: Math.max(...lngs) };
}

export const isInside = (b: Bounds, p: Pick<Place, 'lat' | 'lng'>): boolean =>
  hasValidLocation(p) && p.lat >= b.south && p.lat <= b.north && p.lng >= b.west && p.lng <= b.east;
