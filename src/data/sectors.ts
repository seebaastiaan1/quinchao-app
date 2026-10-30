import { places } from './places';

// Sectores de la isla = valores de `area` de los lugares (Achao, Putique, Quinchao, Palqui...).
// No llevan coordenadas propias: el encuadre de cada sector se calcula con sus lugares (ver map.ts).
export const sectors: string[] = Array.from(new Set(places.map((p) => p.area)));
