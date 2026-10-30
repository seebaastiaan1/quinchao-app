import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { categoryColor } from '@/data/categories';
import type { Place } from '@/data/types';
import { colors, fonts, radius, shadow, spacing } from '@/theme';
import { AppText } from './AppText';

export const MAP_CARD_WIDTH = 260;

// Tarjeta del panel inferior del mapa: tocarla centra el mapa; "Ver ficha" abre el detalle.
export function MapCard({ place, selected, onPress, onOpen }: { place: Place; selected?: boolean; onPress: () => void; onOpen: () => void }) {
  const color = categoryColor(place.category);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Centrar el mapa en ${place.title}`}
      accessibilityState={{ selected: !!selected }}
      style={[styles.card, selected && { borderColor: color }]}
    >
      <Image source={{ uri: place.image }} style={styles.image} />
      <View style={styles.copy}>
        <View style={styles.meta}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <AppText variant="small" numberOfLines={1} style={{ flex: 1 }}>{place.tag} · {place.area}</AppText>
        </View>
        <AppText variant="heading" numberOfLines={1} style={{ fontSize: 15 }}>{place.title}</AppText>
        <Pressable onPress={onOpen} accessibilityRole="link" accessibilityLabel={`Ver ficha de ${place.title}`} style={styles.link}>
          <AppText style={styles.linkText}>Ver ficha</AppText>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: MAP_CARD_WIDTH, flexDirection: 'row', gap: spacing.md, padding: spacing.sm, backgroundColor: colors.white, borderRadius: radius.md, borderWidth: 2, borderColor: colors.line, ...shadow },
  image: { width: 72, height: 88, borderRadius: radius.sm, backgroundColor: colors.mist },
  copy: { flex: 1, justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 2, minHeight: 44, alignSelf: 'flex-start' },
  linkText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
});
