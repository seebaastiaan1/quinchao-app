import type { Category, CategoryKey } from './types';

export const categories: Category[] = [
  { key: 'gastronomia', label: 'Gastronomía', title: 'Sabores de Quinchao', subtitle: 'Sabores de la isla', icon: 'restaurant-outline', intro: 'Cocinerías, mercados y mesas que celebran los productos del mar y la tradición chilota.' },
  { key: 'hospedajes', label: 'Hoteles y hospedajes', title: 'Descansa junto al mar', subtitle: 'Tu lugar para descansar', icon: 'bed-outline', intro: 'Cabañas, hostales y alojamientos con la hospitalidad característica de nuestras islas.' },
  { key: 'experiencias', label: 'Experiencias', title: 'Vive el archipiélago', subtitle: 'Conecta con el territorio', icon: 'compass-outline', intro: 'Navegaciones, caminatas y encuentros culturales para descubrir Quinchao a tu propio ritmo.' },
  { key: 'emergencias', label: 'Servicios y emergencias', title: 'Estamos para ayudarte', subtitle: 'Información esencial', icon: 'medkit-outline', intro: 'Números y servicios esenciales disponibles para residentes y visitantes.' },
  { key: 'reciclaje', label: 'Reciclaje', title: 'Cuidemos nuestras islas', subtitle: 'Cuidemos Quinchao', icon: 'leaf-outline', intro: 'Ubica puntos limpios y conoce qué materiales recibe cada estación.' },
];

export const getCategory = (key: string): Category | undefined => categories.find((c) => c.key === (key as CategoryKey));
