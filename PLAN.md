# Plan de desarrollo — App Quinchao (v1)

> Documento para trabajar con **agentes gratuitos en VS Code** (Copilot Free, Gemini Code Assist, Continue/Cline con claves gratuitas, etc.).
> Las tareas son pequeñas y autocontenidas a propósito: los modelos gratuitos rinden mejor con instrucciones cortas y criterios de aceptación claros.

## 1. Resumen
- **Cliente:** Municipalidad de Quinchao. **Equipo:** Ramírez, Jaramillo, Gutiérrez, Brown, Vidal. Ramo: Programación de aplicaciones móviles (U. de Los Lagos).
- **Objetivo:** punto único de acceso a información de la comuna: gastronomía, hotelería y hospedaje, experiencias, servicios y emergencias, reciclaje, mapa e información útil.
- **Stack:** Expo SDK 54 · React Native · TypeScript · Expo Router · `react-native-maps` · Poppins. Se prueba en **Expo Go**.
- **Origen del diseño:** Figma Make `Quinchao` (versión web React+Vite) → se **porta** a React Native. Los datos de ejemplo ya están en `src/data`.

## 2. Estructura del proyecto
```
app/                      # rutas (Expo Router)
  _layout.tsx             # fuentes Poppins + Stack
  (tabs)/                 # barra inferior: Inicio · Explorar · Mapa · Información
    index.tsx  explore.tsx  map.tsx  info.tsx
  category/[key].tsx      # Listado de una categoría (pantallas 3–7 del inventario)
  place/[id].tsx          # Detalle + Contacto (pantallas 8 y 10)
src/
  theme/index.ts          # colores, espaciado, tipografía
  data/                   # types, categories, places, actions (llamar / cómo llegar)
  components/             # AppText, Button, Pill, PlaceCard, CategoryRow, Screen
```
**Correspondencia con el documento (inventario de 10 pantallas):** 1 Inicio → `(tabs)/index` · 2 Explorar → `(tabs)/explore` · 3–7 Gastronomía/Hoteles/Experiencias/Servicios/Reciclaje → `category/[key]` · 8 Detalle → `place/[id]` · 9 Mapa → `(tabs)/map` · 10 Información útil → `(tabs)/info`.

## 3. Decisiones y puntos abiertos (revisar con el docente/cliente)
- **Alcance v1:** sin servidor. Datos locales en `src/data`. Quedan fuera: sincronización, creación de rutas, tablero de noticias.
- **RF-04 (Administrador)** exige agregar/modificar/eliminar contenido → requiere backend; **se pospone a v2**. En v1 el contenido se edita en `src/data`.
- **RNF-03 (autenticación)** no aplica mientras no exista el rol Administrador; en v1 no hay login.
- **Reportes de problemas** (calles, basura, luminarias) aparecen en el objetivo del documento pero **no tienen pantalla** ni requerimiento. Pendiente: pregunta 3 al cliente.
- **Qué es "emergencia"** (pregunta 1 al cliente): hasta tener respuesta se usan 131 Salud, 132 Bomberos, 133 Carabineros, 137 Capitanía.
- **Imágenes:** las de Unsplash son temporales; el documento exige imágenes autorizadas por la municipalidad.
- **Coordenadas y datos** de `src/data/places.ts` son de ejemplo/aproximados: verificar y reemplazar.
- **Versión de SDK:** debe coincidir con la de Expo Go instalado en los teléfonos (ver tarea 0.2).

## 4. Cómo usar este plan con agentes gratuitos
1. Abre el proyecto en VS Code y el chat del agente en **modo agente/edición**.
2. Adjunta siempre `AGENTS.md` y `PLAN.md` como contexto (en Copilot ya se lee `.github/copilot-instructions.md`).
3. Pide **una sola tarea** con esta plantilla:
   ```
   Lee AGENTS.md y PLAN.md. Realiza únicamente la tarea X.Y de PLAN.md.
   Modifica solo los archivos indicados. Al terminar ejecuta `npm run typecheck`,
   corrige los errores y marca la tarea con [x] en PLAN.md. No hagas nada más.
   ```
4. Revisa el diff, prueba en Expo Go y haz un commit por tarea (`git commit -m "tarea 4.2: filtros en listado"`).
5. Si el agente se pierde: reinicia el chat, vuelve a adjuntar `AGENTS.md` y repite la tarea. Tareas muy grandes → dividirlas.
6. Límites y modelos gratuitos cambian con frecuencia; revisen los vigentes de cada herramienta. Si se agota la cuota, cambien de herramienta usando este mismo plan.

## 5. Tareas
Leyenda: **[RF-xx]** requerimiento funcional del documento · **Verificación** = cómo saber que está listo.

### Fase 0 — Preparar el entorno
- [ ] **0.1** Instalar dependencias: `npm install`. *Verificación:* termina sin errores.
- [ ] **0.2** Alinear versiones con Expo Go: `npx expo install --fix` y `npx expo-doctor`. Si Expo Go exige un SDK más nuevo: `npx expo install expo@latest` y luego `npx expo install --fix`. *Verificación:* `npx expo-doctor` sin errores críticos.
- [ ] **0.3** Ejecutar `npx expo start`, escanear el QR con Expo Go y ver las 4 pestañas. *Verificación:* la app abre sin pantalla roja.
- [ ] **0.4** Crear `assets/icon.png` (1024×1024) y `assets/splash.png` con el logo y referenciarlos en `app.json` (`icon`, `splash`). *Verificación:* el ícono se ve en el build.
- [ ] **0.5** `git init`, primer commit y repositorio compartido del equipo.

### Fase 1 — Base visual (archivos: `src/theme`, `src/components`)
- [ ] **1.1** Revisar que Poppins carga en todas las pantallas. *Verificación:* ningún texto usa la fuente del sistema.
- [ ] **1.2** Crear `src/components/EmptyState.tsx` (ícono + mensaje) y usarlo cuando una lista no tenga resultados. 
- [ ] **1.3** Añadir un componente `SectionHeader` (eyebrow + título) y usarlo en Inicio, Explorar y Categoría para evitar repetir estilos.

### Fase 2 — Contenido real (archivos: `src/data/*`)
- [ ] **2.1** Reemplazar los lugares de ejemplo de **Gastronomía** por datos reales (nombre, sector, horario, teléfono, coordenadas verificadas). No inventar: si falta un dato, `// TODO(equipo)`.
- [ ] **2.2** Idem **Hoteles y hospedajes**.
- [ ] **2.3** Idem **Experiencias** (tours y recorridos; fuente: https://www.municipalidadquinchao.cl/cquinchao/turismo-2/).
- [ ] **2.4** Idem **Servicios y emergencias** (teléfonos reales, tras responder la pregunta 1 al cliente).
- [ ] **2.5** Idem **Reciclaje** (puntos, materiales, horarios).
- [ ] **2.6** Agregar a `Place` el campo opcional `sector` con valores `'Achao' | 'Putique' | 'Quinchao' | 'Palqui' | ...` y completarlo en todos los lugares (se usa en la fase 7).
- [ ] **2.7** Reemplazar imágenes por las autorizadas por la municipalidad (guardar en `assets/images/` y usar `require`).

### Fase 3 — Inicio (pantalla 1) — `app/(tabs)/index.tsx`
- [ ] **3.1** Comparar con el boceto de Figma (hero, buscador, accesos a categorías, botón de emergencias) y ajustar espaciados y textos.
- [ ] **3.2** Que el buscador lleve a Explorar con el texto escrito (ya existe el parámetro `q`); probar que funciona.
- [ ] **3.3** Sección "Imperdibles": 3 tarjetas horizontales (`FlatList horizontal`) con lugares marcados `featured: true` (agregar el campo en `types.ts`).

### Fase 4 — Explorar y Listado (pantallas 2–7) — `explore.tsx`, `category/[key].tsx`
- [ ] **4.1** Explorar: la búsqueda debe ignorar tildes y mayúsculas (`normalize('NFD')`). Extraer la función a `src/data/search.ts`.
- [ ] **4.2** Listado: filtro por **sector** con `Pill` ("Todos", "Achao", "Putique"…). [RF-01]
- [ ] **4.3** Listado: botón "Ver en mapa" que abre `/map` con la categoría ya filtrada (parámetro `category`).
- [ ] **4.4** Listado: filtro "Abierto ahora" (requiere campo `hours` estructurado; definir formato simple primero y documentarlo en `types.ts`).
- [ ] **4.5** *(opcional)* Filtro "Cerca de mí" con `npx expo install expo-location` (pedir permiso solo al tocar el filtro; manejar permiso denegado).

### Fase 5 — Detalle y Contacto (pantallas 8 y 10) — `place/[id].tsx`
- [ ] **5.1** Galería de fotos horizontal si el lugar tiene más de una imagen (`images?: string[]`).
- [ ] **5.2** Botones "Llamar" y "Cómo llegar" funcionando en dispositivo real. [RF-06]
- [ ] **5.3** Botón "Compartir" con `Share` de React Native (título + dirección).
- [ ] **5.4** Mostrar bloque "Datos útiles" (entrada, precio, recomendaciones) solo si el dato existe.

### Fase 6 — Mapa (pantalla 9) — `app/(tabs)/map.tsx`
- [ ] **6.1** Verificar marcadores y navegación al detalle desde el callout. [RF-02]
- [ ] **6.2** Marcadores con ícono y color por categoría (usar `Marker` con vista personalizada o `pinColor`). [RF-05]
- [ ] **6.3** Parámetros `category` y `focus`: aplicar filtro inicial y centrar el mapa. 
- [ ] **6.4** Panel inferior (bottom sheet simple con `FlatList`) con la lista de lugares visibles y toque para ir al detalle.
- [ ] **6.5** **Secciones por sector de la isla**: chips "Achao / Putique / Quinchao…" que reencuadran el mapa (`animateToRegion`). Objetivo del documento: mapa dividido en secciones para que no sea desordenado.
- [ ] **6.6** Probar en Android e iOS (en Expo Go los mapas funcionan; en un build propio de Android hará falta una clave de Google Maps).

### Fase 7 — Información útil (pantalla 10) — `app/(tabs)/info.tsx`
- [ ] **7.1** Crear `src/data/info.ts` con los artículos (cómo llegar, moverse, clima/temporada, consejos).
- [ ] **7.2** Crear `app/info/[slug].tsx` (“Leer más”) y enlazar desde las tarjetas.
- [ ] **7.3** Contenido de "Cómo llegar" con ferries/buses reales (verificar fuentes oficiales).

### Fase 8 — Emergencias (RF-06)
- [ ] **8.1** En la categoría Emergencias: barra fija con 131 / 132 / 133 / 137 y botones de llamada directa.
- [ ] **8.2** Botón rojo "Emergencias" accesible desde cualquier pestaña (header o botón flotante). 
- [ ] **8.3** Confirmar con `Alert` antes de llamar a un número de emergencia.

### Fase 9 — Calendario de actividades (RF-03, prioridad media)
- [ ] **9.1** Definir tipo `EventItem` (título, fecha, tipo cultural/deportiva/recreativa/comunitaria, lugar) y `src/data/events.ts`.
- [ ] **9.2** Pantalla `app/events.tsx` con lista agrupada por fecha y filtro por tipo; enlazar desde Inicio.

### Fase 10 — Calidad y entrega
- [ ] **10.1** Accesibilidad: etiquetas, contraste, tamaño de texto del sistema, área táctil ≥ 44 px. [RNF-01]
- [ ] **10.2** Rendimiento: listas con `FlatList`, imágenes con tamaño fijo; respuesta < 2 s. [RNF-02]
- [ ] **10.3** Funcionamiento sin internet: los datos son locales; mostrar un mensaje amable si faltan imágenes/mapa.
- [ ] **10.4** Recorridos de usuario del documento (probar a mano y anotar resultados):
  1. Inicio → Gastronomía → Detalle → Mapa/Llamar.
  2. Inicio → Reciclaje → Detalle → Mapa.
- [ ] **10.5** Revisión final: `npm run typecheck`, `npx expo-doctor`, revisar textos (ortografía) y retirar los `TODO(equipo)` pendientes.
- [ ] **10.6** *(opcional)* Build de prueba con EAS (`npx eas build --profile preview`) para instalar un APK sin Expo Go.

## 6. Definición de "terminado" para una tarea
- Compila y se ve bien en Expo Go (Android y/o iOS).
- `npm run typecheck` sin errores.
- Respeta `AGENTS.md` (tokens del tema, componentes existentes, español, accesibilidad).
- Commit con mensaje que cita el número de tarea.
