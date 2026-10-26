import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '@/theme';
import type { IconName } from '@/data/types';
import { AppText } from './AppText';

// Textos cortos, orientados a la acción ("Llamar", "Cómo llegar").
export function Button({ label, icon, onPress, variant = 'primary' }: { label: string; icon?: IconName; onPress: () => void; variant?: 'primary' | 'outline' | 'danger' }) {
  const outline = variant === 'outline';
  const bg = variant === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.btn, outline ? styles.outline : { backgroundColor: bg }, pressed && { opacity: 0.85 }]}
    >
      {icon && <Ionicons name={icon} size={18} color={outline ? colors.primary : colors.white} />}
      <AppText variant="button" style={outline ? { color: colors.primary } : undefined}>{label}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, paddingHorizontal: 20, borderRadius: radius.md },
  outline: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.primary },
});
