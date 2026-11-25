import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { getCategory } from '@/data/categories';
import { boundsOf, filterByCategory, filterBySector, isInside, type Bounds, type CategoryFilter } from '@/data/map';
import { usePlace, usePlaces } from '@/data/placesStore';
import type { Place } from '@/data/types';

// Acciones sobre el mapa que implementa cada plataforma (Leaflet en WebView o Leaflet web).
interface MapControls {
  frame: (bounds: Bounds | null) => void; // null = vista inicial de la isla
  center: (place: Place) => void;
}

// Si el lugar enfocado no pertenece al filtro actual, se vuelve a "Todo" para que su marcador se vea.
const filterFor = (place: Place, current: CategoryFilter): CategoryFilter =>
  current === 'todo' || current === place.category ? current : 'todo';

// Estado de la pantalla Mapa: filtros, sector, selección, lugares en el área visible y parámetros `focus` / `category`.
export function useMapScreen(controls: MapControls) {
  const params = useLocalSearchParams<{ focus?: string; category?: string }>();
  const paramCategory = params.category ? getCategory(params.category)?.key : undefined;
  const { places } = usePlaces();
  const focusPlace = usePlace(params.focus);

  const [filter, setFilter] = useState<CategoryFilter>(() => {
    const initial = paramCategory ?? 'todo';
    return focusPlace ? filterFor(focusPlace, initial) : initial;
  });
  const [sector, setSector] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | undefined>(focusPlace?.id);
  const [viewBounds, setViewBounds] = useState<Bounds | null>(null);

  // Vista con la que se abre el mapa (antes de que exista la instancia para animarlo)
  const [initialView] = useState(() => ({
    place: focusPlace,
    bounds: paramCategory ? boundsOf(filterByCategory(places, paramCategory)) : null,
  }));

  const filtered = useMemo(() => filterByCategory(places, filter), [places, filter]);
  const visible = useMemo(() => (viewBounds ? filtered.filter((p) => isInside(viewBounds, p)) : filtered), [filtered, viewBounds]);

  const frameFor = (c: CategoryFilter, s: string | null) =>
    controls.frame(s === null && c === 'todo' ? null : boundsOf(filterBySector(filterByCategory(places, c), s)));

  const selectCategory = (c: CategoryFilter) => {
    setFilter(c);
    frameFor(c, sector);
  };

  const selectSector = (s: string | null) => {
    setSector(s);
    if (s === null) controls.frame(null);
    else frameFor(filter, s);
  };

  const selectPlace = (place: Place) => {
    setSelectedId(place.id);
    controls.center(place);
  };

  // Navegaciones posteriores a la pestaña con nuevos parámetros (la pestaña queda montada)
  useEffect(() => {
    if (!paramCategory) return;
    setFilter(paramCategory);
    setSector(null);
    controls.frame(boundsOf(filterByCategory(places, paramCategory)));
  }, [paramCategory]);

  useEffect(() => {
    if (!focusPlace) return;
    setFilter((f) => filterFor(focusPlace, f));
    selectPlace(focusPlace);
  }, [focusPlace]);

  return { filter, sector, selectedId, visible, initialView, selectCategory, selectSector, selectPlace, setViewBounds };
}
