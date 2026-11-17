// PIN local del modo administración. NO es seguridad real: solo evita que un visitante entre por accidente.
// La autenticación de verdad llega con el backend (v2). Ver PLAN.md, sección 3 (RNF-03).
// TODO(equipo): definir el PIN con la municipalidad.
export const ADMIN_PIN = '0000';

export const isValidPin = (pin: string): boolean => pin.trim() === ADMIN_PIN;
