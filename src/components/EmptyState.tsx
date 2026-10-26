import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';

export function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={28} color={colors.muted} />
      <AppText variant="small" style={styles.message}>{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xxl },
  message: { textAlign: 'center' },
});