import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import type { IconName } from '@/data/types';
import { AppText } from './AppText';

export function Pill({ label, active, icon, onPress }: { label: string; active?: boolean; icon?: IconName; onPress?: () => void }) {
  const color = active ? colors.white : colors.muted;
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: !!active }} style={[styles.pill, active && styles.active]}>
      {icon && <Ionicons name={icon} size={14} color={color} />}
      <AppText style={{ fontFamily: fonts.medium, fontSize: 13, color }}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  active: { backgroundColor: colors.navy, borderColor: colors.navy },
});
