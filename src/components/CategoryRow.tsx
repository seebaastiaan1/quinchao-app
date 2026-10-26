import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme';
import type { Category } from '@/data/types';
import { AppText } from './AppText';

export function CategoryRow({ category, onPress }: { category: Category; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={category.label} style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.sea }]}>
      <View style={styles.icon}>
        <Ionicons name={category.icon} size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="heading">{category.label}</AppText>
        <AppText variant="small">{category.subtitle}</AppText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  icon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.sea, alignItems: 'center', justifyContent: 'center' },
});
