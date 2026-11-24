import * as FileSystem from 'expo-file-system/legacy';

type MapTile = { z: number; x: number; y: number };
type TileBounds = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};
type TileArea = { bounds: TileBounds; zoomLevels: readonly number[] };

const TILE_BATCH_SIZE = 5;
const TILE_BATCH_DELAY_MS = 250;
const TILE_SERVER_URL = 'https://tile.openstreetmap.de';
const TILE_USER_AGENT = 'QuinchaoTurismoApp/1.0 (Expo; ReactNative)';
const TILE_AREAS: TileArea[] = [
  {
    bounds: {
      minLatitude: -42.56,
      maxLatitude: -42.38,
      minLongitude: -73.62,
      maxLongitude: -73.35,
    },
    zoomLevels: [10, 11, 12, 13, 14],
  },
  {
    bounds: {
      minLatitude: -42.48,
      maxLatitude: -42.466,
      minLongitude: -73.514,
      maxLongitude: -73.494,
    },
    zoomLevels: [15, 16],
  },
];

let preloadPromise: Promise<boolean> | undefined;

function longitudeToTileX(longitude: number, zoom: number) {
  return Math.floor(((longitude + 180) / 360) * 2 ** zoom);
}

function latitudeToTileY(latitude: number, zoom: number) {
  const radians = (latitude * Math.PI) / 180;
  return Math.floor(((1 - Math.asinh(Math.tan(radians)) / Math.PI) / 2) * 2 ** zoom);
}

function getQuinchaoTiles(): MapTile[] {
  const tiles: MapTile[] = [];

  for (const { bounds, zoomLevels } of TILE_AREAS) {
    for (const z of zoomLevels) {
      const minX = longitudeToTileX(bounds.minLongitude, z);
      const maxX = longitudeToTileX(bounds.maxLongitude, z);
      const minY = latitudeToTileY(bounds.maxLatitude, z);
      const maxY = latitudeToTileY(bounds.minLatitude, z);

      for (let x = minX; x <= maxX; x += 1) {
        for (let y = minY; y <= maxY; y += 1) {
          tiles.push({ z, x, y });
        }
      }
    }
  }

  return tiles;
}

async function downloadQuinchaoTiles() {
  const documentDirectory = FileSystem.documentDirectory;
  if (!documentDirectory) {
    throw new Error('No está disponible el almacenamiento local de la aplicación.');
  }

  const tilesDirectory = `${documentDirectory}tiles/`;
  const completionMarker = `${tilesDirectory}.quinchao-v2-complete`;
  const markerInfo = await FileSystem.getInfoAsync(completionMarker);
  if (markerInfo.exists) return true;

  const tiles = getQuinchaoTiles();
  let unavailableTiles = 0;
  const tilesDirectoryInfo = await FileSystem.getInfoAsync(tilesDirectory);
  if (!tilesDirectoryInfo.exists) {
    await FileSystem.makeDirectoryAsync(tilesDirectory, { intermediates: true });
  }

  const directories = new Set(tiles.map(({ z, x }) => `${tilesDirectory}${z}/${x}/`));
  for (const directory of directories) {
    const info = await FileSystem.getInfoAsync(directory);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
  }

  for (let offset = 0; offset < tiles.length; offset += TILE_BATCH_SIZE) {
    const batch = tiles.slice(offset, offset + TILE_BATCH_SIZE);
    const results = await Promise.all(
      batch.map(async ({ z, x, y }) => {
        const fileUri = `${tilesDirectory}${z}/${x}/${y}.png`;
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists && (info.size === undefined || info.size > 0)) return 'cached';
        if (info.exists) await FileSystem.deleteAsync(fileUri, { idempotent: true });

        const downloadUri = `${fileUri}.download`;
        const result = await FileSystem.downloadAsync(
          `${TILE_SERVER_URL}/${z}/${x}/${y}.png`,
          downloadUri,
          { headers: { 'User-Agent': TILE_USER_AGENT } },
        );

        if (result.status !== 200) {
          await FileSystem.deleteAsync(downloadUri, { idempotent: true });
          unavailableTiles += 1;
          return 'unavailable';
        }

        await FileSystem.moveAsync({ from: downloadUri, to: fileUri });
        return 'downloaded';
      }),
    );

    const attemptedDownloads = results.some((result) => result !== 'cached');
    if (attemptedDownloads && offset + batch.length < tiles.length) {
      await new Promise((resolve) => setTimeout(resolve, TILE_BATCH_DELAY_MS));
    }
  }

  if (unavailableTiles > 0) return false;

  await FileSystem.writeAsStringAsync(completionMarker, 'complete');
  return true;
}

export function preloadQuinchaoTiles() {
  if (!preloadPromise) {
    preloadPromise = downloadQuinchaoTiles().catch((error: unknown) => {
      preloadPromise = undefined;
      throw error;
    });
  }

  return preloadPromise;
}
