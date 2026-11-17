import type { DownloadResult, OfflineManifest } from './types';

// Versión web: el navegador no permite guardar archivos como el teléfono.
// La copia sin conexión es una función de la app móvil; en web solo se avisa cuando no hay internet.
export const offlineSupported = false;

export async function loadManifest(): Promise<OfflineManifest | null> {
  return null;
}

export const localUri = (_manifest: OfflineManifest | null, _url: string): string | null => null;

export async function downloadPack(_urls: string[], version: number, _onProgress: (done: number, total: number) => void): Promise<DownloadResult> {
  return { manifest: { version, savedAt: new Date().toISOString(), bytes: 0, files: {} }, failed: 0 };
}

export async function removePack(): Promise<void> {}
