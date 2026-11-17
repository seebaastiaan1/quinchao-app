import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AdminGate, AppText, Button, EmptyState, Pill, SectionHeader } from '@/components';
import { confirmRemovePlace } from '@/data/admin';
import { categories, getCategory } from '@/data/categories';
import type { CategoryFilter } from '@/data/map';
import { usePlaces } from '@/data/placesStore';
import type { Place } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

export default function AdminScreen() {
  return (
    <AdminGate>
      <AdminList />
    </AdminGate>
  );
}

function AdminList() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { places, removePlace, resetPlaces } = usePlaces();
  const [filter, setFilter] = useState<CategoryFilter>('todo');

  const items = useMemo(() => (filter === 'todo' ? places : places.filter((p) => p.category === filter)), [places, filter]);

  const addPlace = () =>
    router.push(filter === 'todo' ? '/admin/new' : { pathname: '/admin/new', params: { category: filter } });

  const editPlace = (place: Place) => router.push({ pathname: '/admin/edit/[id]', params: { id: place.id } });

  const restore = () =>
    Alert.alert(
      '¿Restaurar datos originales?',
      'Se perderán todos los lugares agregados, editados o eliminados en este teléfono.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restaurar', style: 'destructive', onPress: () => {
          resetPlaces();
          Alert.alert('Datos restaurados', 'La app volvió a la lista original de lugares.');
        } },
      ],
    );

  const header = (
    <View style={{ gap: spacing.lg }}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" style={styles.back}>
        <Ionicons name="chevron-back" size={20} color={colors.primary} />
        <AppText style={{ color: colors.primary }}>Volver</AppText>
      </Pressable>
      <SectionHeader eyebrow="Municipalidad de Quinchao" title="Administración" />
      <AppText variant="small">
        Los cambios se guardan solo en este teléfono. Para que lleguen a todos los usuarios hará falta un servidor (versión 2).
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        <Pill label="Todas" active={filter === 'todo'} onPress={() => setFilter('todo')} />
        {categories.map((c) => (
          <Pill key={c.key} label={c.label} active={filter === c.key} onPress={() => setFilter(c.key)} />
        ))}
      </ScrollView>
      <Button label="Agregar lugar" icon="add-circle-outline" onPress={addPlace} />
      <AppText variant="small">{items.length === 1 ? '1 lugar' : `${items.length} lugares`}</AppText>
    </View>
  );

  const footer = (
    <View style={styles.footer}>
      <Button label="Restaurar datos originales" icon="refresh-outline" variant="outline" onPress={restore} />
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(p) => p.id}
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={[styles.list, { paddingTop: insets.top + spacing.lg }]}
      ListHeaderComponent={header}
      ListEmptyComponent={<EmptyState message="No hay lugares en esta categoría." />}
      ListFooterComponent={footer}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View style={{ gap: 2 }}>
            <AppText variant="heading">{item.title}</AppText>
            <AppText variant="small">{getCategory(item.category)?.label ?? item.category} · {item.area}</AppText>
          </View>
          <View style={styles.actions}>
            <View style={{ flex: 1 }}>
              <Button label="Editar" icon="create-outline" variant="outline" onPress={() => editPlace(item)} />
            </View>
            <View style={{ flex: 1 }}>
              <Button label="Eliminar" icon="trash-outline" variant="danger" onPress={() => confirmRemovePlace(item, () => removePlace(item.id))} />
            </View>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.md },
  item: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  actions: { flexDirection: 'row', gap: spacing.sm },
  footer: { paddingTop: spacing.xl },
});
