import type { Place } from './types';

// Paquete sin conexión: qué se descarga para poder consultar la app en modo avión.
// Los textos (lugares, categorías, teléfonos, direcciones) ya vienen dentro de la app y no necesitan descarga.
// Lo único que requiere una descarga previa son las fotografías remotas (las que son una URL).
// Subir este número cuando cambie el contenido obliga a los teléfonos a actualizar su copia.
export const OFFLINE_VERSION = 1;

// Foto que se descarga de internet. Las incluidas en la app (`require`) y las elegidas desde la galería (file://) ya están en el teléfono.
export const isRemoteImage = (image: Place['image']): image is string => typeof image === 'string' && /^https?:\/\//.test(image);

// Fotografías remotas de los lugares (del store, incluye los agregados por el administrador), sin repetir.
export const offlineImages = (list: Place[]): string[] => Array.from(new Set(list.map((p) => p.image).filter(isRemoteImage)));

// Textos que la interfaz muestra sobre el modo sin conexión (pantalla Información).
export const offlineAlways: string[] = [
  'Teléfonos de emergencia y botón Llamar',
  'Fichas de lugares: dirección, horario y descripción',
  'Categorías, búsqueda y filtros',
  'Información útil',
];
export const offlineWithCopy: string[] = ['Fotografías de los lugares'];
export const offlineNever: string[] = ['Mapa de fondo (calles y relieve)', 'Ruta de «Cómo llegar»'];
