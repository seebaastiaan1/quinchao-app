import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

// Abre la galería y devuelve el uri local de la foto elegida (null si se cancela o no hay permiso).
// El permiso se pide solo al tocar el botón.
export async function pickImageFromGallery(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert(
      'Sin acceso a tus fotos',
      'Para elegir una imagen, permite el acceso a la galería en los ajustes del teléfono. También puedes pegar una URL https://.',
      permission.canAskAgain
        ? [{ text: 'Entendido' }]
        : [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ],
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [16, 9],
    quality: 0.7,
  });
  return result.canceled ? null : result.assets[0]?.uri ?? null;
}
