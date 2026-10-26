import { Alert, Linking } from 'react-native';
import type { Place } from './types';

export function callPlace(phone?: string) {
  if (!phone) return;
  Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('No se pudo abrir el teléfono'));
}

// "Cómo llegar": abre la app de mapas del dispositivo (Google Maps web funciona en iOS y Android).
export function openDirections(place: Pick<Place, 'lat' | 'lng'>) {
  Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`).catch(() =>
    Alert.alert('No se pudo abrir el mapa'),
  );
}
