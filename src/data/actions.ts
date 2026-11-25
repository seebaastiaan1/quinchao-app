import { Alert, Linking } from 'react-native';
import { cleanPhone, hasValidLocation } from './availability';
import type { Place } from './types';

export function callPlace(phone?: string) {
  const validPhone = cleanPhone(phone);
  if (!validPhone) {
    Alert.alert('Contacto no disponible', 'Este registro no tiene un teléfono válido.');
    return;
  }
  Linking.openURL(`tel:${validPhone}`).catch(() => Alert.alert('No se pudo abrir el teléfono'));
}

// Abre la navegación solo cuando existen coordenadas válidas y confirmadas.
export function openDirections(place: Pick<Place, 'lat' | 'lng'>) {
  if (!hasValidLocation(place)) {
    Alert.alert('Ubicación no confirmada', 'Este lugar no tiene coordenadas válidas para generar indicaciones.');
    return;
  }
  Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`).catch(() =>
    Alert.alert('No se pudo abrir el mapa'),
  );
}
