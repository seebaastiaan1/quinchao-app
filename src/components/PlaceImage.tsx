import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp } from 'react-native';
import { isValidImage } from '@/data/availability';
import { useOffline } from '@/offline';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';

// Fotografía de un lugar. Conserva las dimensiones recibidas y muestra un placeholder si falta o falla.
export function PlaceImage({ image, style, compact }: { image?: string | number | null; style?: StyleProp<ImageStyle>; compact?: boolean }) {
  const { imageSource, hasLocalCopy, isOnline } = useOffline();
  const [failed, setFailed] = useState(false);
  const validImage = isValidImage(image);
  const local = validImage ? hasLocalCopy(image) : false;

  useEffect(() => setFailed(false), [image, isOnline, local]);

  if (!validImage || failed || (!local && !isOnline)) {
    return (
      <View style={[style, styles.placeholder]} accessibilityRole="image" accessibilityLabel="Fotografía no disponible">
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
