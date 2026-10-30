import { useEffect, useRef } from 'react';
import { FlatList, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { categories } from '@/data/categories';
import type { CategoryFilter } from '@/data/map';
import { sectors } from '@/data/sectors';
import type { Place } from '@/data/types';
import { colors, radius, shadow, spacing } from '@/theme';
import { AppText } from './AppText';
import { MAP_CARD_WIDTH, MapCard } from './MapCard';
import { Pill } from './Pill';

// Panel superior del mapa: filtro por categoría (RF-05), chips de sector y contador de lugares visibles.
export function MapFilters({ filter, sector, count, onCategory, onSector, style }: {
  filter: CategoryFilter;
  sector: string | null;
  count: number;
  onCategory: (c: CategoryFilter) => void;
  onSector: (s: string | null) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.panel, style]}>
      <AppText variant="eyebrow">Mapa de Quinchao</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pill label="Todo" active={filter === 'todo'} onPress={() => onCategory('todo')} />
        {categories.map((c) => (
          <Pill key={c.key} label={c.label} active={filter === c.key} onPress={() => onCategory(c.key)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.row, { paddingTop: 0 }]}>
        <Pill label="Toda la isla" icon="map-outline" active={sector === null} onPress={() => onSector(null)} />
        {sectors.map((s) => (
          <Pill key={s} label={s} icon="location-outline" active={sector === s} onPress={() => onSector(s)} />
        ))}
      </ScrollView>
      <AppText variant="small">{count === 1 ? '1 lugar en esta área' : `${count} lugares en esta área`}</AppText>
    </View>
  );
}

const ITEM_SPAN = MAP_CARD_WIDTH + spacing.md;

// Panel inferior: tarjetas horizontales de los lugares visibles.
export function MapCardList({ places, selectedId, onSelect, onOpen, style }: {
  places: Place[];
  selectedId?: string;
  onSelect: (place: Place) => void;
  onOpen: (place: Place) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const listRef = useRef<FlatList<Place>>(null);

  // Al seleccionar un marcador, desplaza la lista hasta su tarjeta
  useEffect(() => {
    const index = places.findIndex((p) => p.id === selectedId);
    if (index >= 0) listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
  }, [selectedId]);

  if (places.length === 0) return null;

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={places}
      keyExtractor={(p) => p.id}
      style={style}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      getItemLayout={(_, index) => ({ length: ITEM_SPAN, offset: spacing.md + ITEM_SPAN * index, index })}
      renderItem={({ item }) => (
        <MapCard place={item} selected={item.id === selectedId} onPress={() => onSelect(item)} onOpen={() => onOpen(item)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  panel: { position: 'absolute', left: spacing.md, right: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, ...shadow },
  row: { gap: spacing.sm, paddingVertical: spacing.sm },
  list: { gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
});
