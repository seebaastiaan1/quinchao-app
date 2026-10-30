import { places } from './places';
import type { CategoryKey, Place } from './types';

// Lógica del mapa compartida entre map.tsx (react-native-maps) y map.web.tsx (Leaflet).
export type CategoryFilter = CategoryKey | 'todo';

export interface Bounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

// Centro aproximado de la isla Quinchao (vista inicial)
export const ISLAND_CENTER = { lat: -42.45, lng: -73.47 };

export const filterByCategory = (category: CategoryFilter): Place[] => (category === 'todo' ? places : places.filter((p) => p.category === category));
export const filterBySector = (list: Place[], sector: string | null): Place[] => (sector ? list.filter((p) => p.area === sector) : list);

export function boundsOf(list: Place[]): Bounds | null {
  if (list.length === 0) return null;
  const lats = list.map((p) => p.lat);
  const lngs = list.map((p) => p.lng);
  return { south: Math.min(...lats), west: Math.min(...lngs), north: Math.max(...lats), east: Math.max(...lngs) };
}

export const isInside = (b: Bounds, p: Pick<Place, 'lat' | 'lng'>): boolean =>
  p.lat >= b.south && p.lat <= b.north && p.lng >= b.west && p.lng <= b.east;
