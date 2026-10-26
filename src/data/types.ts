import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryKey = 'gastronomia' | 'hospedajes' | 'experiencias' | 'emergencias' | 'reciclaje';

export interface Category {
  key: CategoryKey;
  title: string; // título grande de la pantalla
  label: string; // nombre corto (tarjetas / pestañas)
  subtitle: string;
  intro: string;
  icon: IconName;
}

export interface Place {
  id: string;
  category: CategoryKey;
  title: string;
  area: string; // sector de la isla: Achao, Putique, Quinchao, Palqui...
  tag: string;
  image: string;
  note: string; // horario o dato corto
  description: string;
  address?: string;
  phone?: string;
  // TODO(equipo): coordenadas APROXIMADAS, verificar con Google Maps antes de entregar.
  lat: number;
  lng: number;
}
