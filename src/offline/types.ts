// Registro de la copia guardada en el teléfono (se escribe como manifest.json junto a las fotos).
export interface OfflineManifest {
  version: number; // OFFLINE_VERSION con que se descargó
  savedAt: string; // fecha ISO de la descarga
  bytes: number; // tamaño total en disco
  files: Record<string, string>; // URL de la foto -> nombre del archivo guardado
}

export interface DownloadResult {
  manifest: OfflineManifest;
  failed: number; // fotos que no se pudieron descargar
}
