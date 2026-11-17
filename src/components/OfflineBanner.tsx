import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOffline } from '@/offline';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';

// Aviso fijo en la parte superior mientras no hay internet. Explica qué está viendo el usuario.
export function OfflineBanner() {
  const insets = useSafeAreaInsets();
  const { isOnline, status } = useOffline();
  if (isOnline) return null;

  const text = status === 'ready' ? 'Sin conexión · mostrando el contenido guardado' : 'Sin conexión · las fotos y el mapa pueden no verse';
  return (
    <View style={[styles.banner, { paddingTop: insets.top + spacing.sm }]} accessibilityRole="alert" accessibilityLabel={text}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.white} />
      <AppText variant="small" style={styles.text}>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.deep, paddingBottom: spacing.sm, paddingHorizontal: spacing.lg },
  text: { color: colors.white, flexShrink: 1 },
});
