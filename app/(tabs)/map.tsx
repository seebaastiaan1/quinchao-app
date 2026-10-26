import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Pill } from '@/components';
import { categories } from '@/data/categories';
import { getPlace, places } from '@/data/places';
import type { CategoryKey } from '@/data/types';
import { colors, radius, spacing } from '@/theme';

// Centro aproximado de la isla Quinchao
const INITIAL_REGION: Region = { latitude: -42.45, longitude: -73.47, latitudeDelta: 0.22, longitudeDelta: 0.22 };

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const mapRef = useRef<MapView>(null);
  const [filter, setFilter] = useState<CategoryKey | 'todo'>('todo');

  const visible = useMemo(() => (filter === 'todo' ? places : places.filter((p) => p.category === filter)), [filter]);

  useEffect(() => {
    const place = focus ? getPlace(focus) : undefined;
    if (place) mapRef.current?.animateToRegion({ latitude: place.lat, longitude: place.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 400);
  }, [focus]);

  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mapRef} style={StyleSheet.absoluteFill} initialRegion={INITIAL_REGION}>
        {visible.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.title}
            description={p.note}
            pinColor={colors.primary}
            onCalloutPress={() => router.push({ pathname: '/place/[id]', params: { id: p.id } })}
          />
        ))}
      </MapView>

      {/* Panel de filtros (RF-05): todo / categorías */}
      <View style={[styles.panel, { top: insets.top + spacing.sm }]}>
        <AppText variant="eyebrow">Mapa de Quinchao</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm, paddingVertical: spacing.sm }}>
          <Pill label="Todo" active={filter === 'todo'} onPress={() => setFilter('todo')} />
          {categories.map((c) => (
            <Pill key={c.key} label={c.label} active={filter === c.key} onPress={() => setFilter(c.key)} />
          ))}
        </ScrollView>
        <AppText variant="small">{visible.length} lugares en esta área</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { position: 'absolute', left: spacing.md, right: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
});
