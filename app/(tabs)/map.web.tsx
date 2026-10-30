import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import { AppText, MapCardList, MapFilters, useMapScreen } from '@/components';
import { categoryColor } from '@/data/categories';
import { ISLAND_CENTER, type Bounds } from '@/data/map';
import type { Place } from '@/data/types';
import { colors, fonts, spacing } from '@/theme';

// Versión web del mapa (Leaflet + OpenStreetMap, sin API key). react-native-maps no funciona en navegador.
// Excepción a la regla 4 de AGENTS.md: Leaflet necesita su contenedor DOM (lo crea MapContainer) y el HTML de L.divIcon.
const INITIAL_CENTER: L.LatLngTuple = [ISLAND_CENTER.lat, ISLAND_CENTER.lng];
const INITIAL_ZOOM = 12;
const FOCUS_ZOOM = 15;
// Margen para que los marcadores no queden bajo los paneles superior e inferior
const FIT_OPTIONS: L.FitBoundsOptions = { paddingTopLeft: [40, 210], paddingBottomRight: [40, 150], maxZoom: FOCUS_ZOOM };

const toLatLngBounds = (b: Bounds) => L.latLngBounds([b.south, b.west], [b.north, b.east]);
const fromLatLngBounds = (b: L.LatLngBounds): Bounds => ({ south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() });

// Círculo del color de la categoría con borde blanco; más grande si está seleccionado
const icons = new Map<string, L.DivIcon>();
function markerIcon(color: string, selected: boolean): L.DivIcon {
  const key = `${color}-${selected}`;
  const cached = icons.get(key);
  if (cached) return cached;
  const size = selected ? 30 : 20;
  const icon = L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
    html: `<div style="width:${size}px;height:${size}px;box-sizing:border-box;border-radius:50%;background:${color};border:3px solid ${colors.white};box-shadow:0 2px 6px ${colors.navy}66"></div>`,
  });
  icons.set(key, icon);
  return icon;
}

// Informa el área visible al cargar y tras cada movimiento (contador y panel inferior)
function ViewportTracker({ onChange }: { onChange: (b: Bounds) => void }) {
  const map = useMapEvents({ moveend: () => onChange(fromLatLngBounds(map.getBounds())) });
  useEffect(() => onChange(fromLatLngBounds(map.getBounds())), [map]);
  return null;
}

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<L.Map>(null);
  const map = useMapScreen({
    frame: (b) => {
      if (b) mapRef.current?.fitBounds(toLatLngBounds(b), FIT_OPTIONS);
      else mapRef.current?.flyTo(INITIAL_CENTER, INITIAL_ZOOM);
    },
    center: (p) => mapRef.current?.flyTo([p.lat, p.lng], FOCUS_ZOOM),
  });
  const [initialView] = useState(() => {
    const { place, bounds } = map.initialView;
    if (place) return { center: [place.lat, place.lng] as L.LatLngTuple, zoom: FOCUS_ZOOM };
    return bounds ? { bounds: toLatLngBounds(bounds), boundsOptions: FIT_OPTIONS } : { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
  });

  const openPlace = (p: Place) => router.push({ pathname: '/place/[id]', params: { id: p.id } });

  return (
    <View style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <MapContainer ref={mapRef} {...initialView} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ViewportTracker onChange={map.setViewBounds} />
          {map.visible.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={markerIcon(categoryColor(p.category), p.id === map.selectedId)}
              eventHandlers={{ click: () => map.selectPlace(p) }}
            >
              <Popup autoPan={false}>
                <View style={styles.popup}>
                  <AppText variant="heading" style={{ fontSize: 15 }}>{p.title}</AppText>
                  <AppText variant="small">{p.note}</AppText>
                  <Link href={{ pathname: '/place/[id]', params: { id: p.id } }} accessibilityLabel={`Ver ficha de ${p.title}`} style={styles.popupLink}>
                    Ver ficha
                  </Link>
                </View>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </View>

      <MapFilters
        filter={map.filter}
        sector={map.sector}
        count={map.visible.length}
        onCategory={map.selectCategory}
        onSector={map.selectSector}
        style={styles.top}
      />
      <MapCardList places={map.visible} selectedId={map.selectedId} onSelect={map.selectPlace} onOpen={openPlace} style={styles.cards} />
    </View>
  );
}

// zIndex por encima de los paneles de Leaflet (400–1000)
const styles = StyleSheet.create({
  top: { top: spacing.sm, zIndex: 1100 },
  cards: { position: 'absolute', left: 0, right: 0, bottom: spacing.sm, zIndex: 1100 },
  popup: { gap: 2, minWidth: 180 },
  popupLink: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, paddingVertical: spacing.xs },
});
