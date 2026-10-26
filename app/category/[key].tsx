import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { AppText, Button, EmptyState, PlaceCard, Screen } from '@/components';
import { callPlace } from '@/data/actions';
import { getCategory } from '@/data/categories';
import { placesByCategory } from '@/data/places';
import { colors, spacing } from '@/theme';

export default function CategoryScreen() {
  const router = useRouter();
  const { key } = useLocalSearchParams<{ key: string }>();
  const category = getCategory(key);

  if (!category) {
    return (
      <Screen>
        <AppText variant="heading">Categoría no encontrada</AppText>
        <Button label="Volver" onPress={() => router.back()} />
      </Screen>
    );
  }

  const items = placesByCategory(category.key);

  return (
    <Screen>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>Volver</AppText>
      </Pressable>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="eyebrow">{category.label}</AppText>
        <AppText variant="title">{category.title}</AppText>
        <AppText>{category.intro}</AppText>
      </View>
      {category.key === 'emergencias' && (
        <View style={{ gap: spacing.sm }}>
          <Button label="Llamar al 131 · Salud" icon="call-outline" variant="danger" onPress={() => callPlace('131')} />
        </View>
      )}
      {/* TODO(plan fase 5): filtros "Cerca de mí" y "Abierto ahora" */}
      {items.length === 0 ? (
        <EmptyState message="Todavía no hay lugares en esta categoría." />
      ) : (
        items.map((p) => <PlaceCard key={p.id} place={p} onPress={() => router.push({ pathname: '/place/[id]', params: { id: p.id } })} />)
      )}
    </Screen>
  );
}
