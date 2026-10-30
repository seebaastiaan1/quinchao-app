const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// react-native-maps no funciona en web. Expo Router mete todas las rutas al bundle web (también map.tsx),
// aunque en navegador se muestra map.web.tsx (Leaflet). Por eso en web se reemplaza por un módulo vacío.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'react-native-maps') return { type: 'empty' };
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
