import datosQuinchao from '../../assets/data/datos_quinchao.json';
import { cleanText, hasValidLocation, isValidCoordinate } from './availability';
import type { Place } from './types';

// Puntos verdes (reciclaje) exportados del mapa municipal en GeoJSON (assets/data/datos_quinchao.json).
// Se convierten en lugares de la categoría "reciclaje" para que tengan ficha, tarjeta en el mapa y búsqueda.
// TODO(equipo): el archivo no trae horario, dirección ni foto; completarlos desde la app (admin) o en el GeoJSON.

interface Feature {
  geometry: { type: string; coordinates: unknown };
  properties?: { name?: unknown; description?: unknown } | null;
}

// Marcas de trabajo del archivo original ("punto verde 3 ok", "punto verde 13 extra") que duplican puntos numerados
const DRAFT_NAME = /\b(ok|extra)\s*$/i;
// Distancia máxima para heredar el sector del lugar conocido más cercano
const MAX_SECTOR_KM = 2.5;

// Nombres de materiales unificados (el archivo mezcla mayúsculas, tildes y variantes); se muestran en este orden
const MATERIALS: { match: RegExp; label: string }[] = [
  { match: /botella|pl[aá]stic|pet/i, label: 'Plásticos' },
  { match: /lata|alumin/i, label: 'Latas' },
  { match: /vidrio/i, label: 'Vidrio' },
  { match: /cart[oóò]n/i, label: 'Cartón' },
  { match: /papel/i, label: 'Papel' },
  { match: /org[aáà]nic/i, label: 'Orgánico' },
];

function rawDescription(description: unknown): string | null {
  if (typeof description === 'string') return description;
  if (typeof description === 'object' && description !== null && 'value' in description) {
    const value: unknown = description.value;
    return typeof value === 'string' ? value : null;
  }
  return null;
}

function materialsOf(description: unknown): string[] {
  const raw = rawDescription(description);
  if (!raw) return [];
  const lines = raw
    .replace(/<br\s*\/?>|<\/div>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean);
  const labels = lines.map((line) => {
    const known = MATERIALS.find((m) => m.match.test(line));
    return known ? known.label : line.charAt(0).toUpperCase() + line.slice(1).toLowerCase();
  });
  const order = (label: string) => {
    const i = MATERIALS.findIndex((m) => m.label === label);
    return i === -1 ? MATERIALS.length : i;
  };
  return Array.from(new Set(labels)).sort((a, b) => order(a) - order(b));
}

const joinList = (items: string[]) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;

const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const rad = Math.PI / 180;
  const x = (b.lng - a.lng) * rad * Math.cos(((a.lat + b.lat) / 2) * rad);
  const y = (b.lat - a.lat) * rad;
  return Math.sqrt(x * x + y * y) * 6371;
};

// Sector del lugar conocido más cercano (si está a menos de MAX_SECTOR_KM); si no, queda sin sector
function nearestArea(point: { lat: number; lng: number }, known: Place[]): string {
  let best: { area: string; km: number } | null = null;
  for (const place of known) {
    const area = cleanText(place.area);
    if (!area || !hasValidLocation(place)) continue;
    const km = distanceKm(point, place);
    if (km <= MAX_SECTOR_KM && (!best || km < best.km)) best = { area, km };
  }
  return best ? best.area : '';
}

export function greenPointPlaces(known: Place[]): Place[] {
  return (datosQuinchao.features as Feature[]).flatMap((feature, index) => {
    if (feature.geometry.type !== 'Point' || !Array.isArray(feature.geometry.coordinates)) return [];
    const [lng, lat] = feature.geometry.coordinates as unknown[];
    const name = typeof feature.properties?.name === 'string' ? feature.properties.name.replace(/\s+/g, ' ').trim() : '';
    if (!name || DRAFT_NAME.test(name) || !isValidCoordinate(lat, -90, 90) || !isValidCoordinate(lng, -180, 180)) return [];

    const materials = materialsOf(feature.properties?.description);
    const place: Place = {
      id: `punto-verde-${index}`,
      category: 'reciclaje',
      title: name,
      area: nearestArea({ lat, lng }, known),
      tag: materials.length ? materials.join(' · ') : 'Punto verde',
      image: null,
      note: null,
      description: materials.length
        ? `Punto verde municipal. Recibe: ${joinList(materials.map((m) => m.toLowerCase()))}.`
        : 'Punto verde municipal.',
      address: null,
      phone: null,
      lat,
      lng,
    };
    return [place];
  });
}
