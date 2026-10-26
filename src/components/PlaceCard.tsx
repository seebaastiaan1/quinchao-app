import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, shadow, spacing } from '@/theme';
import type { Place } from '@/data/types';
import { AppText } from './AppText';

export function PlaceCard({ place, onPress }: { place: Place; onPress: () => void }) {
  const isEmergency = place.category === 'emergencias';
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={place.title} style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}>
      <View>
        <Image source={{ uri: place.image }} style={styles.image} />
        <View style={styles.tag}>
          <AppText variant="small" style={{ color: colors.navy }}>{place.tag}</AppText>
        </View>
      </View>
      <View style={styles.copy}>
        <AppText variant="small">{place.area}</AppText>
        <AppText variant="heading">{place.title}</AppText>
        <View style={styles.note}>
          <Ionicons name={isEmergency ? 'call-outline' : 'time-outline'} size={15} color={colors.turquoise} />
          <AppText variant="small">{place.note}</AppText>
        </View>
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
