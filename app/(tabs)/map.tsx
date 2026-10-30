import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapCardList, MapFilters, useMapScreen } from '@/components';
import { getCategory } from '@/data/categories';
import { ISLAND_CENTER, type Bounds } from '@/data/map';
import type { Place } from '@/data/types';
import { colors, spacing } from '@/theme';

// Versión móvil (react-native-maps). En web se usa map.web.tsx (Leaflet).
const INITIAL_REGION: Region = { latitude: ISLAND_CENTER.lat, longitude: ISLAND_CENTER.lng, latitudeDelta: 0.22, longitudeDelta: 0.22 };
const MIN_DELTA = 0.03;

const regionAround = (p: Place): Region => ({ latitude: p.lat, longitude: p.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 });

// Margen x2 para que los marcadores no queden bajo los paneles superior e inferior
const regionFromBounds = (b: Bounds): Region => ({
  latitude: (b.south + b.north) / 2,
  longitude: (b.west + b.east) / 2,
  latitudeDelta: Math.max((b.north - b.south) * 2, MIN_DELTA),
  longitudeDelta: Math.max((b.east - b.west) * 2, MIN_DELTA),
});

const boundsFromRegion = (r: Region): Bounds => ({
  south: r.latitude - r.latitudeDelta / 2,
  north: r.latitude + r.latitudeDelta / 2,
  west: r.longitude - r.longitudeDelta / 2,
  east: r.longitude + r.longitudeDelta / 2,
});

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const map = useMapScreen({
    frame: (b) => mapRef.current?.animateToRegion(b ? regionFromBounds(b) : INITIAL_REGION, 400),
    center: (p) => mapRef.current?.animateToRegion(regionAround(p), 400),
  });
  const [initialRegion] = useState(() => {
    const { place, bounds } = map.initialView;
    if (place) return regionAround(place);
    return bounds ? regionFromBounds(bounds) : INITIAL_REGION;
  });

  const openPlace = (p: Place) => router.push({ pathname: '/place/[id]', params: { id: p.id } });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={initialRegion}
        onMapReady={() => map.setViewBounds(boundsFromRegion(initialRegion))}
        onRegionChangeComplete={(r) => map.setViewBounds(boundsFromRegion(r))}
      >
        {map.visible.map((p) => {
          const category = getCategory(p.category);
          const selected = p.id === map.selectedId;
          const size = selected ? 40 : 30;
          return (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lng }}
              title={p.title}
              description={p.note}
              onPress={() => map.selectPlace(p)}
              onCalloutPress={() => openPlace(p)}
            >
              {/* Marcador con color e ícono por categoría (RF-05) */}
              <View style={[styles.marker, { width: size, height: size, borderRadius: size / 2, backgroundColor: category?.color ?? colors.primary }]}>
                <Ionicons name={category?.icon ?? 'location-outline'} size={selected ? 20 : 15} color={colors.white} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      <MapFilters
        filter={map.filter}
        sector={map.sector}
        count={map.visible.length}
        onCategory={map.selectCategory}
        onSector={map.selectSector}
        style={{ top: insets.top + spacing.sm }}
      />
      <MapCardList places={map.visible} selectedId={map.selectedId} onSelect={map.selectPlace} onOpen={openPlace} style={styles.cards} />
    </View>
  );
}

const styles = StyleSheet.create({
  marker: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  cards: { position: 'absolute', left: 0, right: 0, bottom: spacing.sm },
});
