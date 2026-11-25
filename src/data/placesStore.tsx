import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { greenPoints, places as initialPlaces } from './places';
import type { CategoryKey, Place } from './types';

// Único punto de lectura/escritura de lugares. En v2 se podrá conectar a un servidor sin tocar las pantallas.
const STORAGE_KEY = 'quinchao:places:v1';
// Versión de los datos iniciales ya entregados al teléfono. Al subirla se agregan una vez los lugares nuevos
// a la lista guardada, sin pisar lo que el administrador editó o borró después.
const SEED_KEY = 'quinchao:places:seed';
const SEED_VERSION = 2; // 2 = puntos verdes del GeoJSON municipal

const CATEGORY_KEYS: readonly CategoryKey[] = ['gastronomia', 'hospedajes', 'experiencias', 'emergencias', 'reciclaje'];

interface PlacesContextValue {
  places: Place[];
  ready: boolean;
  addPlace: (place: Place) => void;
  updatePlace: (id: string, changes: Partial<Omit<Place, 'id'>>) => void;
  removePlace: (id: string) => void;
  resetPlaces: () => void;
}

const PlacesContext = createContext<PlacesContextValue | null>(null);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOptionalString = (value: unknown) => value === undefined || value === null || typeof value === 'string';
const isOptionalCoordinate = (value: unknown) => value === undefined || value === null || typeof value === 'number';

function isPlace(value: unknown): value is Place {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.category === 'string' &&
    CATEGORY_KEYS.some((key) => key === value.category) &&
    typeof value.title === 'string' &&
    typeof value.area === 'string' &&
    typeof value.tag === 'string' &&
    (value.image === undefined || value.image === null || typeof value.image === 'string' || typeof value.image === 'number') &&
    isOptionalString(value.note) &&
    isOptionalString(value.description) &&
    isOptionalString(value.address) &&
    isOptionalString(value.phone) &&
    isOptionalCoordinate(value.lat) &&
    isOptionalCoordinate(value.lng)
  );
}

function parseStored(raw: string): Place[] | null {
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) && data.every(isPlace) ? data : null;
  } catch {
    return null;
  }
}

// Agrega a la lista guardada los lugares de las versiones de datos que este teléfono aún no recibió
function migrate(stored: Place[], seedVersion: number): Place[] {
  if (seedVersion >= 2) return stored;
  const ids = new Set(stored.map((p) => p.id));
  return [...stored, ...greenPoints.filter((p) => !ids.has(p.id))];
}

function persist(list: Place[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list)).catch(() => {
    // Si no se puede guardar, los cambios siguen en memoria mientras la app esté abierta.
  });
}

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.multiGet([STORAGE_KEY, SEED_KEY])
      .then(([[, raw], [, seed]]) => {
        if (!active) return;
        const stored = raw === null ? null : parseStored(raw);
        if (stored) {
          const seedVersion = Number(seed) || 1;
          const migrated = migrate(stored, seedVersion);
          setPlaces(migrated);
          if (migrated !== stored) persist(migrated);
        }
        AsyncStorage.setItem(SEED_KEY, String(SEED_VERSION)).catch(() => {
          // Si no se guarda, la próxima vez se vuelve a intentar sin duplicar (se comparan los id).
        });
      })
      .catch(() => {
        // Lectura fallida: se mantienen los datos iniciales.
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const apply = useCallback((change: (list: Place[]) => Place[]) => {
    setPlaces((current) => {
      const next = change(current);
      persist(next);
      return next;
    });
  }, []);

  const addPlace = useCallback((place: Place) => apply((list) => [...list, place]), [apply]);

  const updatePlace = useCallback(
    (id: string, changes: Partial<Omit<Place, 'id'>>) =>
      apply((list) => list.map((p) => (p.id === id ? { ...p, ...changes, id } : p))),
    [apply],
  );

  const removePlace = useCallback((id: string) => apply((list) => list.filter((p) => p.id !== id)), [apply]);

  const resetPlaces = useCallback(() => {
    setPlaces(initialPlaces);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {
      // Si no se puede borrar, la próxima lectura podría traer la lista anterior.
    });
  }, []);

  const value = useMemo(
    () => ({ places, ready, addPlace, updatePlace, removePlace, resetPlaces }),
    [places, ready, addPlace, updatePlace, removePlace, resetPlaces],
  );

  return <PlacesContext.Provider value={value}>{children}</PlacesContext.Provider>;
}

export function usePlaces(): PlacesContextValue {
  const context = useContext(PlacesContext);
  if (!context) throw new Error('usePlaces debe usarse dentro de <PlacesProvider>.');
  return context;
}

export function usePlace(id: string | undefined): Place | undefined {
  const { places } = usePlaces();
  return useMemo(() => places.find((p) => p.id === id), [places, id]);
}
