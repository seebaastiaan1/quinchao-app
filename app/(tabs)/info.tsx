import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppText, Button, Screen } from '@/components';
import type { IconName } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

// Pantalla 10 del inventario: información relevante para residentes y visitantes.
// TODO(plan fase 8): contenido real y subpantallas "Leer más".
const items: { icon: IconName; title: string; text: string }[] = [
  { icon: 'boat-outline', title: 'Cómo llegar', text: 'Ferries, buses y rutas para llegar hasta el archipiélago.' },
  { icon: 'bus-outline', title: 'Moverse por Quinchao', text: 'Transporte local, distancias y recomendaciones.' },
  { icon: 'partly-sunny-outline', title: 'Clima y temporada', text: 'Qué esperar del tiempo y cuál es la mejor época para venir.' },
  { icon: 'shield-checkmark-outline', title: 'Consejos para tu visita', text: 'Pequeñas claves para una experiencia responsable y segura.' },
];

export default function InfoScreen() {
  const router = useRouter();
  return (
    <Screen>
      <View style={{ backgroundColor: colors.navy, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.xs }}>
        <AppText variant="eyebrow" style={{ color: colors.sun }}>Prepara tu viaje</AppText>
        <AppText variant="title" style={{ color: colors.white }}>Información útil</AppText>
        <AppText style={{ color: colors.sea }}>Todo lo que necesitas saber para disfrutar Quinchao sin apuros.</AppText>
      </View>

      {items.map((item, i) => (
        <View key={item.title} style={{ borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Ionicons name={item.icon} size={26} color={colors.primary} />
            <AppText variant="small">0{i + 1}</AppText>
          </View>
          <AppText variant="heading">{item.title}</AppText>
          <AppText variant="small">{item.text}</AppText>
        </View>
      ))}

      <Button label="Ver contactos de emergencia" icon="call-outline" variant="danger" onPress={() => router.push({ pathname: '/category/[key]', params: { key: 'emergencias' } })} />
    </Screen>
  );
}
