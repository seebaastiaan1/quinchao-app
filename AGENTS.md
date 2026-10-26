# Quinchao App — instrucciones para agentes de IA

App móvil de la Municipalidad de Quinchao (Chiloé). **Expo (SDK 54) + React Native + TypeScript + Expo Router.**
Se prueba con **Expo Go** (no hay carpeta `android/` ni `ios/`; no hacer `prebuild`).
El diseño de referencia viene del Figma Make (web) y del documento `app_quinchao_3_0.pdf`.

## Reglas obligatorias
1. Trabaja **UNA tarea de `PLAN.md` a la vez**. Léela completa antes de tocar código. Al terminar, marca `[x]` en `PLAN.md`.
2. Responde y escribe textos de la interfaz **en español** (Chile). Código y nombres de variables en inglés o español consistente con el archivo.
3. **No instales paquetes** que no estén en `package.json` salvo que la tarea lo pida. Instala con `npx expo install <paquete>` (nunca `npm install` para librerías de Expo/RN).
4. **No uses**: `localStorage`, `div`/`span`/`img`, CSS, Tailwind, `react-router`, `window`, `document`. Esto es React Native: `View`, `Text`, `Image`, `Pressable`, `StyleSheet`.
5. Estilos: usa **solo** los tokens de `src/theme` (`colors`, `spacing`, `radius`, `fonts`). No escribas colores hex sueltos. Tipografía **Poppins**.
6. Textos con `<AppText>`; botones con `<Button>`; filtros con `<Pill>`. No crees componentes nuevos si ya existe uno equivalente en `src/components`.
7. Datos **solo** en `src/data/*`. Las pantallas no llevan datos escritos a mano.
8. Rutas = archivos dentro de `app/` (Expo Router). Importa con el alias `@/` (apunta a `src/`).
9. Accesibilidad: todo `Pressable` lleva `accessibilityRole` y `accessibilityLabel`; área táctil mínima 44×44.
10. Antes de dar una tarea por terminada ejecuta `npm run typecheck` y confirma que **no hay errores**. No uses `any` ni `// @ts-ignore`.
11. Cambios pequeños: no reescribas archivos completos ni reformatees código que no tocas. No borres archivos sin que la tarea lo indique.
12. Si algo no está claro o falta un dato real (teléfonos, coordenadas, horarios), **no lo inventes**: deja `// TODO(equipo): ...` y avisa.

## Fuera de la v1 (NO implementar)
Sincronización con servidor, creación de rutas, tablero de notificaciones/noticias, panel de administrador.

## Comandos
- `npm install` → instalar · `npx expo start` → servidor (escanear QR con Expo Go)
- `npm run typecheck` → verificación de tipos · `npx expo-doctor` → diagnóstico
