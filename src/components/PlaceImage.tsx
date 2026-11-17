import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';
import { useOffline } from '@/offline';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';

// Fotografía de un lugar. Usa la copia guardada en el teléfono si existe; si no, la descarga de internet.
// Si no hay conexión ni copia (o la foto falla), muestra un recuadro del mismo tamaño para conservar el orden.
export function PlaceImage({ image, style, compact }: { image: string | number; style?: StyleProp<ImageStyle>; compact?: boolean }) {
  const { imageSource, hasLocalCopy, isOnline } = useOffline();
  const [failed, setFailed] = useState(false);
  const local = hasLocalCopy(image);

  // Vuelve a intentar cuando cambia la foto, vuelve la conexión o termina la descarga de la copia
  useEffect(() => setFailed(false), [image, isOnline, local]);

  if (failed || (!local && !isOnline)) {
    return (
      <View style={[style, styles.placeholder]} accessibilityRole="image" accessibilityLabel="Fotografía no disponible sin conexión">
        <Ionicons name="image-outline" size={compact ? 22 : 30} color={colors.muted} />
        {!compact && <AppText variant="small" style={styles.text}>{isOnline ? 'Fotografía no disponible' : 'Fotografía no disponible sin conexión'}</AppText>}
      </View>
    );
  }

  return <Image source={imageSource(image)} style={style} onError={() => setFailed(true)} />;
}

const styles = StyleSheet.create({
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.sea },
  text: { textAlign: 'center', paddingHorizontal: spacing.md },
});
