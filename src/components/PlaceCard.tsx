import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { cleanText } from '@/data/availability';
import { colors, radius, shadow, spacing } from '@/theme';
import type { Place } from '@/data/types';
import { AppText } from './AppText';
import { PlaceImage } from './PlaceImage';

export function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const isEmergency = place.category === 'emergencias';
  const area = cleanText(place.area);
  const tag = cleanText(place.tag);
  const title = cleanText(place.title) ?? 'Información no disponible';
  const note = cleanText(place.note);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View>
        <PlaceImage image={place.image} style={styles.image} />
        {tag && (
          <View style={styles.tag}>
            <AppText variant="small" style={{ color: colors.navy }}>{tag}</AppText>
          </View>
        )}
      </View>
      <View style={styles.copy}>
        {area && <AppText variant="small">{area}</AppText>}
        <AppText variant="heading">{title}</AppText>
        {note && (
          <View style={styles.note}>
            <Ionicons name={isEmergency ? 'call-outline' : 'time-outline'} size={15} color={colors.turquoise} />
            <AppText variant="small">{note}</AppText>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.line, ...shadow },
  image: { width: '100%', height: 160, backgroundColor: colors.mist },
  tag: { position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.white, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  copy: { padding: spacing.lg, gap: 4 },
  note: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
});
