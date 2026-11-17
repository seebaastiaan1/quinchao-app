import { Alert } from 'react-native';
import type { Place } from './types';

// PIN local del modo administración. NO es seguridad real: solo evita que un visitante entre por accidente.
// La autenticación de verdad llega con el backend (v2). Ver PLAN.md, sección 3 (RNF-03).
// TODO(equipo): definir el PIN con la municipalidad.
export const ADMIN_PIN = '0000';

export const isValidPin = (pin: string): boolean => pin.trim() === ADMIN_PIN;

// Confirma antes de eliminar. Los servicios de emergencia piden una segunda confirmación.
export function confirmRemovePlace(place: Pick<Place, 'title' | 'category'>, onConfirm: () => void) {
  const askEmergency = () =>
    Alert.alert(
      'Es un servicio de emergencia',
      'Si lo eliminas, residentes y visitantes ya no verán su número ni su ubicación en la app. ¿Eliminar de todos modos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: onConfirm },
      ],
    );

  Alert.alert(`¿Eliminar ${place.title}?`, 'Esta acción no se puede deshacer.', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Eliminar', style: 'destructive', onPress: place.category === 'emergencias' ? askEmergency : onConfirm },
  ]);
}
