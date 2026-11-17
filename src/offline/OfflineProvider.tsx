import NetInfo from '@react-native-community/netinfo';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { OFFLINE_VERSION, isRemoteImage, offlineImages } from '@/data/offline';
import { usePlaces } from '@/data/placesStore';
import { downloadPack, loadManifest, localUri, offlineSupported, removePack } from './storage';
import type { OfflineManifest } from './types';

// Estado de la copia sin conexión:
// - checking: leyendo el teléfono al abrir la app
// - none: todavía no existe una copia
// - outdated: hay copia, pero falta contenido nuevo
// - downloading: descarga en curso
// - ready: copia completa y al día
export type OfflineStatus = 'checking' | 'none' | 'outdated' | 'downloading' | 'ready';

interface OfflineContextValue {
  supported: boolean; // false en navegador
  isOnline: boolean;
  status: OfflineStatus;
  progress: { done: number; total: number };
  manifest: OfflineManifest | null;
  message: string | null; // resultado de la última acción, para mostrar al usuario
  download: () => Promise<void>;
  remove: () => Promise<void>;
  imageSource: (image: string | number) => ImageSourcePropType; // usa la foto guardada si existe
  hasLocalCopy: (image: string | number) => boolean;
}

const OfflineContext = createContext<OfflineContextValue | null>(null);

const isComplete = (manifest: OfflineManifest, urls: string[]): boolean =>
  manifest.version === OFFLINE_VERSION && urls.every((url) => url in manifest.files);

export function OfflineProvider({ children }: { children: ReactNode }) {
  const { places } = usePlaces();
  const urls = useMemo(() => offlineImages(places), [places]);
  const [isOnline, setIsOnline] = useState(true);
  const [onWifi, setOnWifi] = useState(false);
  const [manifest, setManifest] = useState<OfflineManifest | null>(null);
  const [checked, setChecked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const autoTried = useRef(false);

  // Conexión: `isInternetReachable` puede ser null mientras se comprueba; solo se considera sin conexión si es false.
  useEffect(
    () =>
      NetInfo.addEventListener((state) => {
        setIsOnline(state.isConnected !== false && state.isInternetReachable !== false);
        setOnWifi(state.type === 'wifi' && state.isConnected === true);
      }),
    [],
  );

  useEffect(() => {
    loadManifest().then((saved) => {
      setManifest(saved);
      setChecked(true);
    });
  }, []);

  const download = useCallback(async () => {
    if (!offlineSupported || downloading) return;
    if (!isOnline) {
      setMessage('Necesitas conexión a internet para descargar el contenido.');
      return;
    }
    setDownloading(true);
    setMessage(null);
    setProgress({ done: 0, total: urls.length });
    try {
      const result = await downloadPack(urls, OFFLINE_VERSION, (done, total) => setProgress({ done, total }));
      setManifest(result.manifest);
      setMessage(
        result.failed === 0
          ? 'Contenido guardado. Ya puedes usar la app sin conexión.'
          : `No se pudieron descargar ${result.failed} de ${urls.length} fotografías. Inténtalo de nuevo con mejor señal.`,
      );
    } catch {
      setMessage('No se pudo guardar el contenido. Revisa el espacio disponible e inténtalo de nuevo.');
    } finally {
      setDownloading(false);
    }
  }, [downloading, isOnline, urls]);

  const remove = useCallback(async () => {
    if (downloading) return;
    try {
      await removePack();
      setManifest(null);
      setMessage('Se eliminó la copia sin conexión.');
    } catch {
      setMessage('No se pudo eliminar la copia.');
    }
  }, [downloading]);

  const status: OfflineStatus = !checked ? 'checking' : downloading ? 'downloading' : !manifest ? 'none' : isComplete(manifest, urls) ? 'ready' : 'outdated';

  // Descarga automática solo con Wi-Fi (una vez por sesión), para no gastar los datos móviles del usuario.
  // Con datos móviles la descarga se inicia a mano desde la pestaña Información.
  useEffect(() => {
    if (!offlineSupported || autoTried.current || !onWifi || !isOnline) return;
    if (status !== 'none' && status !== 'outdated') return;
    autoTried.current = true;
    download();
  }, [status, onWifi, isOnline, download]);

  const value = useMemo<OfflineContextValue>(
    () => ({
      supported: offlineSupported,
      isOnline,
      status,
      progress,
      manifest,
      message,
      download,
      remove,
      imageSource: (image) => {
        if (typeof image !== 'string') return image;
        if (!isRemoteImage(image)) return { uri: image };
        return { uri: localUri(manifest, image) ?? image };
      },
      hasLocalCopy: (image) => !isRemoteImage(image) || localUri(manifest, image) !== null,
    }),
    [isOnline, status, progress, manifest, message, download, remove],
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline(): OfflineContextValue {
  const value = useContext(OfflineContext);
  if (!value) throw new Error('useOffline debe usarse dentro de <OfflineProvider>');
  return value;
}
