import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryKey = 'gastronomia' | 'hospedajes' | 'experiencias' | 'emergencias' | 'reciclaje';

export type EventType = 'cultural' | 'deportiva' | 'recreativa' | 'comunitaria';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  type: EventType;
  place: string;
  time: string;
  description: string;
}

export interface Category {
  key: CategoryKey;
  title: string; // título grande de la pantalla
  label: string; // nombre corto (tarjetas / pestañas)
  subtitle: string;
  intro: string;
  icon: IconName;
  color: string; // color del marcador en el mapa (token de src/theme)
}

export interface Place {
  id: string;
  category: CategoryKey;
  title: string;
  area: string; // sector de la isla: Achao, Putique, Quinchao, Palqui...
  tag: string;
  image?: string | number | null;
  note?: string | null; // horario o dato corto
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  lat?: number | null;
  lng?: number | null;
}
