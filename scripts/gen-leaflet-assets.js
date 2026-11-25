// Copia leaflet.js y leaflet.css (node_modules) a un módulo TS para incrustarlos en el WebView del mapa.
// Así el mapa abre sin internet (solo faltarán las imágenes de fondo) y no depende de un CDN.
// Ejecutar después de actualizar la dependencia `leaflet`:  npm run gen:leaflet
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'node_modules', 'leaflet', 'dist');
const js = fs.readFileSync(path.join(dist, 'leaflet.js'), 'utf8').replace(/\/\/# sourceMappingURL=.*$/m, '');
const css = fs.readFileSync(path.join(dist, 'leaflet.css'), 'utf8');
const { version } = require(path.join(root, 'node_modules', 'leaflet', 'package.json'));

const out = `// ARCHIVO GENERADO por scripts/gen-leaflet-assets.js (Leaflet ${version}). No editar a mano.
/* eslint-disable */
export const LEAFLET_JS = ${JSON.stringify(js).replace(/<\/script/gi, '<\\/script')};
export const LEAFLET_CSS = ${JSON.stringify(css)};
`;

const target = path.join(root, 'src', 'map', 'leafletAssets.generated.ts');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out);
console.log(`Leaflet ${version} -> ${path.relative(root, target)} (${Math.round(out.length / 1024)} KB)`);
