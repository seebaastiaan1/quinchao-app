import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapCardList, MapFilters, useMapScreen } from '@/components';
import { categoryColor } from '@/data/categories';
import { greenPoints } from '@/data/greenPoints';
import { ISLAND_CENTER } from '@/data/map';
import { hasValidLocation } from '@/data/availability';
import { usePlaces } from '@/data/placesStore';
import type { Place } from '@/data/types';
import { buildMapHtml, FOCUS_ZOOM, INITIAL_ZOOM, type InitialMapView, type MapEvent, type MapMarker } from '@/map/leafletHtml';
import { useOffline } from '@/offline';
import { colors, spacing } from '@/theme';

// Versión móvil: Leaflet + OpenStreetMap en un WebView (src/map/leafletHtml.ts). En web se usa map.web.tsx.
// No necesita API key de Google y funciona igual en Android, iOS y Expo Go.
const ISLAND: [number, number] = [ISLAND_CENTER.lat, ISLAND_CENTER.lng];
// Origen ficticio de la página: OpenStreetMap pide un Referer válido para servir las imágenes del mapa
const BASE_URL = 'https://app.quinchao.cl/';
// Alto aproximado de los paneles sobre el mapa (filtros arriba, tarjetas abajo)
const TOP_PANEL = 190;
const BOTTOM_PANEL = 150;

const toMarker = (p: Place & { lat: number; lng: number }): MapMarker => ({
  id: p.id,
  lat: p.lat,
  lng: p.lng,
  color: categoryColor(p.category),
  title: p.title,
  note: typeof p.note === 'string' ? p.note : null,
});

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const webRef = useRef<WebView>(null);
  const ready = useRef(false);
  const { isOnline } = useOffline();
  const { places } = usePlaces();

  // Ejecuta una función de window.qmap dentro del WebView (se ignora hasta que el mapa avise que está listo)
  const call = (fn: string, ...args: unknown[]) => {
    if (!ready.current) return;
    webRef.current?.injectJavaScript(`window.qmap && window.qmap.${fn}(${args.map((a) => JSON.stringify(a)).join(',')}); true;`);
  };

  const map = useMapScreen({
    frame: (b) => call('frame', b),
    center: (p) => {
      if (hasValidLocation(p)) call('center', p.lat, p.lng);
    },
  });

  // El HTML se arma una sola vez con la vista inicial; lo demás se actualiza con mensajes
  const [html] = useState(() => {
    const { place, bounds } = map.initialView;
    const initial: InitialMapView =
      place && hasValidLocation(place)
        ? { center: [place.lat, place.lng], zoom: FOCUS_ZOOM }
        : bounds
          ? { bounds }
          : { center: ISLAND, zoom: INITIAL_ZOOM };
    return buildMapHtml({ initial, islandCenter: ISLAND, greenPoints, padding: { top: insets.top + TOP_PANEL, bottom: BOTTOM_PANEL } });
  });

  // Se dibujan todos los lugares del filtro (no solo los del área visible) para poder recorrer el mapa
  const markers = useMemo(
    () => places.filter((p) => (map.filter === 'todo' || p.category === map.filter) && hasValidLocation(p)).map((p) => toMarker(p as Place & { lat: number; lng: number })),
    [places, map.filter],
  );
  const showGreenPoints = map.filter === 'todo' || map.filter === 'reciclaje';

  const syncAll = () => {
    call('setPlaces', markers, map.selectedId ?? null);
    call('setGreenPoints', showGreenPoints);
  };
  useEffect(syncAll, [markers, showGreenPoints]);
  useEffect(() => call('setSelected', map.selectedId ?? null), [map.selectedId]);

  const openPlace = (p: Place) => router.push({ pathname: '/place/[id]', params: { id: p.id } });

  const onMessage = (e: WebViewMessageEvent) => {
    let msg: MapEvent;
    try {
      msg = JSON.parse(e.nativeEvent.data) as MapEvent;
    } catch {
      return;
    }
    if (msg.type === 'ready') {
      ready.current = true;
      syncAll();
    } else if (msg.type === 'bounds') {
      map.setViewBounds(msg.bounds);
    } else {
      const place = places.find((p) => p.id === msg.id);
      if (!place) return;
      if (msg.type === 'select') map.selectPlace(place);
      else openPlace(place);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webRef}
        style={[StyleSheet.absoluteFill, styles.web]}
        originWhitelist={['*']}
        source={{ html, baseUrl: BASE_URL }}
        onMessage={onMessage}
        // Si Android cierra el proceso del WebView en segundo plano, se vuelve a cargar el mapa
        onRenderProcessGone={() => {
          ready.current = false;
          webRef.current?.reload();
        }}
        onContentProcessDidTerminate={() => {
          ready.current = false;
          webRef.current?.reload();
        }}
        cacheEnabled
        cacheMode={isOnline ? 'LOAD_DEFAULT' : 'LOAD_CACHE_ELSE_NETWORK'}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
        overScrollMode="never"
        bounces={false}
        scrollEnabled={false}
        accessibilityLabel="Mapa de la isla Quinchao"
      />

      <MapFilters
        filter={map.filter}
        sector={map.sector}
        count={map.visible.length}
        notice={isOnline ? undefined : 'Sin conexión: el mapa de fondo puede no cargarse. Los lugares y sus fichas siguen disponibles.'}
        onCategory={map.selectCategory}
        onSector={map.selectSector}
        style={{ top: insets.top + spacing.sm }}
      />
      <MapCardList places={map.visible} selectedId={map.selectedId} onSelect={map.selectPlace} onOpen={openPlace} style={styles.cards} />
    </View>
  );
}

const styles = StyleSheet.create({
  web: { backgroundColor: colors.sea },
  cards: { position: 'absolute', left: 0, right: 0, bottom: spacing.sm },
});
