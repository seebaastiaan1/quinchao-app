import type { Bounds } from '@/data/map';
import { colors } from '@/theme';
import { LEAFLET_CSS, LEAFLET_JS } from './leafletAssets.generated';

// Mapa móvil: Leaflet + OpenStreetMap dentro de un WebView (sin API key de Google, igual en Android, iOS y Expo Go).
// React Native -> mapa: window.qmap.<función>(datos) con injectJavaScript.
// Mapa -> React Native: window.ReactNativeWebView.postMessage(JSON) con los tipos de MapEvent.
// Excepción a la regla 4 de AGENTS.md (igual que map.web.tsx): este HTML corre dentro del WebView, no en React Native,
// así que usa document/window y CSS. Los colores salen igualmente de los tokens de src/theme.

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  color: string;
  title: string;
  note: string | null;
}

export type InitialMapView = { center: [number, number]; zoom: number } | { bounds: Bounds };

export type MapEvent =
  | { type: 'ready' }
  | { type: 'bounds'; bounds: Bounds }
  | { type: 'select'; id: string }
  | { type: 'open'; id: string };

export const FOCUS_ZOOM = 15;
export const INITIAL_ZOOM = 12;

interface Options {
  initial: InitialMapView;
  islandCenter: [number, number];
  // Espacio que ocupan los paneles superior e inferior, para encuadrar sin tapar marcadores
  padding: { top: number; bottom: number };
}

// Se pasa como JSON dentro de <script>: se escapa "<" para que ningún texto pueda cerrar la etiqueta.
const toScriptJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

export function buildMapHtml({ initial, islandCenter, padding }: Options): string {
  const config = {
    initial,
    islandCenter,
    initialZoom: INITIAL_ZOOM,
    focusZoom: FOCUS_ZOOM,
    padding,
  };

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>${LEAFLET_CSS}</style>
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${colors.sea}; }
  body { font-family: -apple-system, Roboto, sans-serif; -webkit-tap-highlight-color: transparent; }
  .q-pin { box-sizing: border-box; border-radius: 50%; border: 3px solid ${colors.white}; box-shadow: 0 2px 6px ${colors.navy}66; }
  .q-popup-title { font-weight: 600; font-size: 15px; color: ${colors.navy}; margin-bottom: 2px; }
  .q-popup-note { font-size: 13px; color: ${colors.muted}; white-space: pre-line; }
  .q-popup-link { display: inline-block; margin-top: 6px; padding: 6px 0; font-weight: 600; font-size: 14px; color: ${colors.primary}; background: none; border: 0; }
  .leaflet-top { top: ${padding.top}px; }
  .leaflet-bottom { bottom: ${padding.bottom}px; }
</style>
</head>
<body>
<div id="map"></div>
<script>${LEAFLET_JS}</script>
<script>
(function () {
  var cfg = ${toScriptJson(config)};
  var send = function (msg) { if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg)); };
  var map = L.map('map', { zoomControl: false, attributionControl: true });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var fitOptions = { paddingTopLeft: [40, cfg.padding.top + 20], paddingBottomRight: [40, cfg.padding.bottom + 20], maxZoom: cfg.focusZoom };
  var toLatLngBounds = function (b) { return L.latLngBounds([b.south, b.west], [b.north, b.east]); };
  var reportBounds = function () {
    var b = map.getBounds();
    send({ type: 'bounds', bounds: { south: b.getSouth(), west: b.getWest(), north: b.getNorth(), east: b.getEast() } });
  };
  map.on('moveend', reportBounds);

  if (cfg.initial.bounds) map.fitBounds(toLatLngBounds(cfg.initial.bounds), fitOptions);
  else map.setView(cfg.initial.center, cfg.initial.zoom);

  var el = function (tag, className, text) { var n = document.createElement(tag); n.className = className; if (text) n.textContent = text; return n; };

  // Lugares del store: círculo del color de la categoría, más grande si está seleccionado
  var icons = {};
  var pinIcon = function (color, selected) {
    var key = color + selected;
    if (!icons[key]) {
      var size = selected ? 30 : 20;
      icons[key] = L.divIcon({ className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2], popupAnchor: [0, -size / 2],
        html: '<div class="q-pin" style="width:' + size + 'px;height:' + size + 'px;background:' + color + '"></div>' });
    }
    return icons[key];
  };
  var placesLayer = L.layerGroup().addTo(map);
  var markers = {};
  var selectedId = null;
  var lastData = [];

  var placePopup = function (p) {
    var box = el('div', '');
    box.appendChild(el('div', 'q-popup-title', p.title));
    if (p.note) box.appendChild(el('div', 'q-popup-note', p.note));
    var link = el('button', 'q-popup-link', 'Ver ficha');
    link.onclick = function () { send({ type: 'open', id: p.id }); };
    box.appendChild(link);
    return box;
  };

  window.qmap = {
    setPlaces: function (data, selected) {
      lastData = data;
      selectedId = selected || null;
      placesLayer.clearLayers();
      markers = {};
      data.forEach(function (p) {
        var m = L.marker([p.lat, p.lng], { icon: pinIcon(p.color, p.id === selectedId), zIndexOffset: p.id === selectedId ? 1000 : 0 })
          .bindPopup(placePopup(p), { autoPan: false })
          .on('click', function () { send({ type: 'select', id: p.id }); });
        markers[p.id] = m;
        m.addTo(placesLayer);
      });
    },
    setSelected: function (id) {
      if (id === selectedId) return;
      selectedId = id;
      lastData.forEach(function (p) {
        var m = markers[p.id];
        if (m) { m.setIcon(pinIcon(p.color, p.id === id)); m.setZIndexOffset(p.id === id ? 1000 : 0); }
      });
    },
    frame: function (b) {
      if (b) map.flyToBounds(toLatLngBounds(b), fitOptions);
      else map.flyTo(cfg.islandCenter, cfg.initialZoom);
    },
    center: function (lat, lng) { map.flyTo([lat, lng], Math.max(map.getZoom(), cfg.focusZoom)); }
  };

  send({ type: 'ready' });
  reportBounds();
})();
</script>
</body>
</html>`;
}
