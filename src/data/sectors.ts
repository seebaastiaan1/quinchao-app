import type { Place } from './types';

// Sectores de la isla = valores de `area` de los lugares (Achao, Putique, Quinchao, Palqui...).
// No llevan coordenadas propias: el encuadre de cada sector se calcula con sus lugares (ver map.ts).
export const sectorsOf = (list: Place[]): string[] => Array.from(new Set(list.map((p) => p.area)));
