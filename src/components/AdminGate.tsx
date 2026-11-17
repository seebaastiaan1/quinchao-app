import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAdminSession } from '@/data/adminSession';
import { colors, spacing } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Screen } from './Screen';
import { SectionHeader } from './SectionHeader';
import { TextField } from './TextField';

// Pide el PIN antes de mostrar cualquier pantalla de administración.
export function AdminGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { unlocked, unlock } = useAdminSession();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string>();

  if (unlocked) return <>{children}</>;

  const submit = () => {
    if (unlock(pin)) return;
    setError('PIN incorrecto. Inténtalo de nuevo.');
    setPin('');
  };

  return (
    <Screen>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>Volver</AppText>
      </Pressable>
      <SectionHeader eyebrow="Municipalidad de Quinchao" title="Administrar contenido" />
      <AppText>Esta sección es solo para el personal municipal. Ingresa el PIN para continuar.</AppText>
      <View style={{ gap: spacing.md }}>
        <TextField
          label="PIN"
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setError(undefined);
          }}
          onSubmitEditing={submit}
          error={error}
          keyboardType="number-pad"
          secureTextEntry
          autoFocus
          returnKeyType="done"
        />
        <Button label="Entrar" icon="lock-open-outline" onPress={submit} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
});
