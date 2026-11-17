# Funcionamiento sin conexión (Sprint 3 · línea 2)

Rama: `feature/sin-conexion`. Objetivo del sprint: *consultar un conjunto de contenido útil sin internet (modo avión)*, definiendo **qué requiere una descarga previa** y **qué ocurre si todavía no existe una copia**.

## 1. Conjunto de información disponible sin conexión

| Contenido | ¿Funciona en modo avión? | Por qué |
| --- | --- | --- |
| Teléfonos de emergencia y botón **Llamar** | Siempre | Los datos van dentro de la app y la llamada usa la red telefónica, no internet. |
| Fichas de lugares (nombre, sector, dirección, horario, descripción) | Siempre | Están en `src/data/places.ts`, empaquetadas con la app. |
| Categorías, búsqueda y filtros | Siempre | Trabajan sobre los datos locales. |
| Información útil, logo, portada e íconos | Siempre | Son archivos locales (`require`) y fuentes incluidas. |
| Fotografías de los lugares (URL) | **Requiere descarga previa** | Son remotas; se guardan en el teléfono con el paquete sin conexión. |
| Mapa de fondo (calles) | Requiere internet | Los marcadores, la lista de lugares y las fichas sí siguen funcionando. |
| Ruta de «Cómo llegar» | Requiere internet | Abre Google Maps; sin conexión se muestra la dirección escrita. |

Criterio: primero lo que alguien necesita en una urgencia o caminando por la isla sin señal (a quién llamar, dónde queda, a qué hora abre). Las fotos ayudan pero no son indispensables; el mapa de fondo queda fuera en esta versión.

## 2. Qué requiere una descarga previa

Solo las **fotografías remotas** (las que en `places.ts` son una URL). El paquete se arma solo a partir de los datos: `offlineImages()` en `src/data/offline.ts`.

- **Con Wi-Fi:** la descarga parte sola al abrir la app (una vez por sesión).
- **Con datos móviles:** no se descarga sola, para no gastar el plan del usuario. Se inicia desde **Información → Uso sin conexión → Descargar**.
- Se guarda en la carpeta de documentos de la app (`offline/`), que el sistema no borra al liberar espacio, junto a un `manifest.json` con versión, fecha, tamaño y lista de archivos.
- Si una foto falla, se omite, se informa cuántas faltaron y se conserva lo ya descargado.

## 3. Qué ocurre si todavía no existe una copia

- La app **abre y se puede usar igual**: textos, teléfonos, búsqueda y fichas no dependen de la copia.
- Cada fotografía sin copia se reemplaza por un recuadro del mismo tamaño con el texto «Fotografía no disponible sin conexión» (la pantalla no se desordena).
- Arriba aparece el aviso «Sin conexión · las fotos y el mapa pueden no verse». Si la copia existe dice «Sin conexión · mostrando el contenido guardado».
- En Información, la tarjeta indica «Aún no hay una copia en este teléfono» y explica que podrá descargarse al volver la conexión. Si se intenta descargar sin internet, se muestra un mensaje en vez de fallar.
- En la ficha de un lugar se avisa que «Cómo llegar» necesita internet y se muestra la dirección; en el mapa se avisa que el fondo puede no cargar.

## 4. Estados de la copia

| Estado | Significado | Acción disponible |
| --- | --- | --- |
| `none` | No hay copia | Descargar |
| `downloading` | Descarga en curso (muestra «3 de 7 fotografías») | — |
| `ready` | Copia completa y al día (fecha y tamaño) | Volver a descargar · Eliminar |
| `outdated` | Hay copia, pero falta contenido nuevo | Actualizar copia |

La copia queda `outdated` cuando se agrega una foto nueva a `places.ts` o cuando se sube `OFFLINE_VERSION` en `src/data/offline.ts`. Esto conecta con la línea 3 del sprint (actualizar contenido): quien mantenga la app solo cambia los datos y sube ese número.

## 5. Archivos

- `src/data/offline.ts` — qué entra en el paquete y su versión.
- `src/offline/storage.ts` — descarga, lectura y borrado en el teléfono (`expo-file-system`). `storage.web.ts` es la versión para navegador (no guarda).
- `src/offline/OfflineProvider.tsx` — estado de conexión (`@react-native-community/netinfo`) y de la copia; hook `useOffline()`.
- `src/components/PlaceImage.tsx` — foto con copia local y recuadro alternativo.
- `src/components/OfflineBanner.tsx` — aviso superior. `src/components/OfflineCard.tsx` — tarjeta en Información.
- Pantallas tocadas: `app/_layout.tsx`, `app/(tabs)/info.tsx`, `app/(tabs)/map.tsx`, `app/(tabs)/map.web.tsx`, `app/place/[id].tsx`.

Paquetes nuevos (ambos incluidos en Expo Go): `@react-native-community/netinfo`, `expo-file-system`.

## 6. Cómo probar (modo avión)

1. `npm install` y `npx expo start`; abrir en Expo Go con Wi-Fi.
2. Ir a **Información**: esperar «Listo para usar sin conexión» (o tocar Descargar).
3. Cerrar la app, activar **modo avión** y abrirla de nuevo (en Expo Go, usar una versión ya cargada o un build propio, porque Expo Go necesita red para bajar el código).
4. Revisar: aviso superior, fotos visibles, fichas completas, botón Llamar, aviso en Mapa y en «Cómo llegar».
5. Tocar **Eliminar copia** y repetir en modo avión: deben verse los recuadros en lugar de las fotos.

## 7. Limitaciones conocidas

- En navegador no se guarda copia (solo se muestra el aviso y los recuadros).
- El mapa de fondo no se descarga; queda como mejora futura.
- Las fotos son todavía las temporales de Unsplash; al reemplazarlas por imágenes municipales locales (`require`) ya no necesitarán descarga.
