import * as FileSystem from 'expo-file-system/legacy';

// Copia una foto de la galería a la carpeta de documentos de la app. La copia que entrega el selector
// queda en la caché, que el sistema puede borrar cuando necesita espacio.
// Si la copia falla, se usa el uri original (la foto se ve mientras siga en la caché).
export async function persistPhoto(uri: string): Promise<string> {
  if (!FileSystem.documentDirectory) return uri;
  const dir = `${FileSystem.documentDirectory}fotos-lugares/`;
  const extension = uri.match(/\.(jpe?g|png|heic|webp)$/i)?.[0] ?? '.jpg';
  const target = `${dir}foto-${Date.now()}${extension}`;
  try {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    await FileSystem.copyAsync({ from: uri, to: target });
    return target;
  } catch {
    return uri;
  }
}
