import { Pressable, StyleSheet } from 'react-native';
import { colors, fonts, radius } from '@/theme';
import { AppText } from './AppText';

export function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!active }} style={[styles.pill, active && styles.active]}>
      <AppText style={{ fontFamily: fonts.medium, fontSize: 13, color: active ? colors.white : colors.muted }}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white },
  active: { backgroundColor: colors.navy, borderColor: colors.navy },
});
