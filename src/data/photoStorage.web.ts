// Versión web: el navegador no permite guardar archivos como el teléfono; se usa el uri tal cual.
export async function persistPhoto(uri: string): Promise<string> {
  return uri;
}
