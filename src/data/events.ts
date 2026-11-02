import { colors } from '@/theme';
import type { EventItem, EventType, IconName } from './types';

export const eventTypes: { key: EventType | 'todas'; label: string; icon: IconName; color: string }[] = [
  { key: 'todas', label: 'Todas', icon: 'calendar-outline', color: colors.primary },
  { key: 'cultural', label: 'Culturales', icon: 'musical-notes-outline', color: colors.sun },
  { key: 'deportiva', label: 'Deportivas', icon: 'bicycle-outline', color: colors.turquoise },
  { key: 'recreativa', label: 'Recreativas', icon: 'happy-outline', color: colors.green },
  { key: 'comunitaria', label: 'Comunitarias', icon: 'people-outline', color: colors.navy },
];

// Agenda local de referencia; reemplazar o ampliar con la programación oficial cuando esté disponible.
export const events: EventItem[] = [
  { id: 'fiesta-costumbrista-achao', title: 'Fiesta costumbrista de Achao', date: '2026-11-07', type: 'cultural', place: 'Plaza de Achao', time: '12:00 a 19:00', description: 'Música, oficios y sabores tradicionales de Quinchao.' },
  { id: 'corrida-familiar-quinchao', title: 'Corrida familiar por Quinchao', date: '2026-11-14', type: 'deportiva', place: 'Costanera de Achao', time: '09:30', description: 'Recorrido abierto para todas las edades junto al borde costero.' },
  { id: 'taller-juegos-chilotes', title: 'Tarde de juegos chilotes', date: '2026-11-21', type: 'recreativa', place: 'Gimnasio municipal', time: '15:00 a 18:00', description: 'Juegos tradicionales y actividades para compartir en familia.' },
  { id: 'asamblea-barrial-palqui', title: 'Asamblea barrial de Palqui', date: '2026-11-26', type: 'comunitaria', place: 'Sede social de Palqui', time: '18:30', description: 'Encuentro vecinal para conversar sobre iniciativas del sector.' },
  { id: 'encuentro-musica-islas', title: 'Encuentro de música de las islas', date: '2026-12-05', type: 'cultural', place: 'Centro cultural de Achao', time: '19:00', description: 'Presentación de agrupaciones locales y repertorio chilote.' },
];

export const eventType = (type: EventType) => eventTypes.find((item) => item.key === type);