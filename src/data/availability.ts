export const cleanText = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const text = value.trim();
  return text ? text : null;
};

export const cleanPhone = (value: unknown): string | null => {
  const phone = cleanText(value);
  if (!phone || !/^[0-9+() .-]+$/.test(phone)) return null;
  return phone;
};

export const isValidCoordinate = (value: unknown, min: number, max: number): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

export type LocatedPlace<T extends { lat?: number | null; lng?: number | null }> = T & {
  lat: number;
  lng: number;
};

export const hasValidLocation = <T extends { lat?: number | null; lng?: number | null }>(place: T): place is LocatedPlace<T> =>
  isValidCoordinate(place.lat, -90, 90) && isValidCoordinate(place.lng, -180, 180);

export const isValidImage = (value: unknown): value is string | number =>
  typeof value === 'number' || (typeof value === 'string' && value.trim().length > 0);
