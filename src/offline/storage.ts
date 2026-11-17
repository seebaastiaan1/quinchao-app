import * as FileSystem from 'expo-file-system/legacy';
import type { DownloadResult, OfflineManifest } from './types';

// Almacenamiento de la copia sin conexión en el teléfono (Android / iOS).
// En navegador se usa storage.web.ts, que no guarda nada.
export const offlineSupported = FileSystem.documentDirectory !== null;

// La carpeta de documentos no se borra cuando el sistema libera espacio (a diferencia de la caché).
const dir = () => `${FileSystem.documentDirectory}offline/`;
const manifestPath = () => `${dir()}manifest.json`;

// Nombre de archivo estable para una URL (hash corto), así una foto repetida no se descarga dos veces.
function fileNameFor(url: string): string {
  let hash = 5381;
  for (let i = 0; i < url.length; i++) hash = ((hash << 5) + hash + url.charCodeAt(i)) >>> 0;
  return `foto-${hash.toString(16)}.jpg`;
}

const isManifest = (value: unknown): value is OfflineManifest =>
  typeof value === 'object' && value !== null && 'version' in value && 'savedAt' in value && 'files' in value;

export async function loadManifest(): Promise<OfflineManifest | null> {
  if (!offlineSupported) return null;
  try {
    const info = await FileSystem.getInfoAsync(manifestPath());
    if (!info.exists) return null;
    const parsed: unknown = JSON.parse(await FileSystem.readAsStringAsync(manifestPath()));
    return isManifest(parsed) ? parsed : null;
  } catch {
    return null; // copia dañada = se trata como si no existiera
  }
}

// Ruta local de una foto guardada. Se arma en cada uso porque en iOS la carpeta de la app puede cambiar al actualizarla.
export const localUri = (manifest: OfflineManifest | null, url: string): string | null => {
  const file = manifest?.files[url];
  return file ? `${dir()}${file}` : null;
};

// Descarga las fotos una por una. Si una falla se omite y se informa: no se pierde lo ya descargado.
export async function downloadPack(urls: string[], version: number, onProgress: (done: number, total: number) => void): Promise<DownloadResult> {
  await FileSystem.makeDirectoryAsync(dir(), { intermediates: true });
  const files: Record<string, string> = {};
  let bytes = 0;
  let failed = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const target = `${dir()}${fileNameFor(url)}`;
    try {
      const result = await FileSystem.downloadAsync(url, target);
      if (result.status !== 200) throw new Error(`HTTP ${result.status}`);
      const info = await FileSystem.getInfoAsync(target);
      if (info.exists) bytes += info.size;
      files[url] = fileNameFor(url);
    } catch {
      failed += 1;
      await FileSystem.deleteAsync(target, { idempotent: true }).catch(() => undefined);
    }
    onProgress(i + 1, urls.length);
  }

  const manifest: OfflineManifest = { version, savedAt: new Date().toISOString(), bytes, files };
  await FileSystem.writeAsStringAsync(manifestPath(), JSON.stringify(manifest));
  return { manifest, failed };
}

export async function removePack(): Promise<void> {
  await FileSystem.deleteAsync(dir(), { idempotent: true });
}
