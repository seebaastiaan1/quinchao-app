import type { CategoryKey, Place } from './types';

// Borrador tal como lo edita el formulario de administración (las coordenadas llegan como texto).
export interface PlaceDraft {
  category: CategoryKey | '';
  title: string;
  area: string;
  tag: string;
  note: string;
  description: string;
  address: string;
  phone: string;
  lat: string;
  lng: string;
  image: Place['image']; // URL https:// o imagen local ya incluida en la app (require)
}

export type PlaceErrors = Partial<Record<keyof PlaceDraft, string>>;

// "Iglesia de Achao" → "iglesia-de-achao"
export function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Agrega -2, -3… si el id ya existe.
export function uniqueId(title: string, existing: readonly string[]): string {
  const base = slugify(title) || 'lugar';
  const taken = new Set(existing);
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

// Acepta coma o punto decimal. Devuelve null si no es un número válido.
export function parseCoordinate(value: string): number | null {
  const text = value.trim().replace(',', '.');
  if (text === '') return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

const REQUIRED = 'Este campo es obligatorio.';

export function validatePlace(draft: PlaceDraft): PlaceErrors {
  const errors: PlaceErrors = {};

  if (!draft.category) errors.category = 'Elige una categoría.';
  if (!draft.title.trim()) errors.title = REQUIRED;
  if (!draft.area.trim()) errors.area = REQUIRED;
  if (!draft.tag.trim()) errors.tag = REQUIRED;
  if (!draft.note.trim()) errors.note = REQUIRED;
  if (!draft.description.trim()) errors.description = REQUIRED;

  const lat = parseCoordinate(draft.lat);
  if (lat === null) errors.lat = 'Ingresa la latitud como número (ej.: -42,4709).';
  else if (lat < -90 || lat > 90) errors.lat = 'La latitud debe estar entre -90 y 90.';

  const lng = parseCoordinate(draft.lng);
  if (lng === null) errors.lng = 'Ingresa la longitud como número (ej.: -73,4909).';
  else if (lng < -180 || lng > 180) errors.lng = 'La longitud debe estar entre -180 y 180.';

  const phone = draft.phone.trim();
  if (phone && !/^[0-9+ ]+$/.test(phone)) errors.phone = 'Usa solo números, "+" y espacios.';

  if (typeof draft.image === 'string') {
    const image = draft.image.trim();
    if (!image) errors.image = REQUIRED;
    else if (!/^https:\/\/\S+$/.test(image)) errors.image = 'La imagen debe ser una URL que empiece con https://';
  }

  return errors;
}
