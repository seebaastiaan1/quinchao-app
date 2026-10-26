// Paleta tomada del boceto de Figma Make (index.css). Decisión de equipo: azules, blancos, turquesa, verde y amarillo.
export const colors = {
  primary: '#3652c2',
  navy: '#243778',
  deep: '#1b285c',
  sea: '#e8edff',
  mist: '#f4f6fa',
  paper: '#ffffff',
  turquoise: '#2d9c9a',
  green: '#4e8061',
  sun: '#e5b85c',
  danger: '#c0392b',
  ink: '#263238',
  muted: '#687385',
  line: '#dde2ea',
  white: '#ffffff',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 20, pill: 999 } as const;

// Tipografía definida por el equipo: Poppins
export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const shadow = {
  shadowColor: '#243778',
  shadowOpacity: 0.12,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 4,
} as const;
