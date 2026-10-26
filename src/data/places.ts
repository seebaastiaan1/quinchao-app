import type { Place } from './types';

// Fotos de ejemplo (Unsplash, usadas en el boceto). Reemplazar por imágenes autorizadas por la municipalidad.
const u = (id: string) => `https://images.unsplash.com/${id}?w=1080&q=80&fm=jpg&fit=crop`;
export const photos = {
  hero: u('photo-1770465502516-bf06a8c36315'),
  church: u('photo-1688151027303-ff4e8f5e24fc'),
  coast: u('photo-1630890386406-8ccf8d6b8b91'),
  food: u('photo-1571167366136-b57e07761625'),
  food2: u('photo-1672636402078-4b957a572e4e'),
  cabin: u('photo-1593053272490-e0ed6d6a42c5'),
  kayak: u('photo-1569965335962-2317ff2a7658'),
};

// DATOS DE EJEMPLO tomados del boceto de Figma Make. Reemplazar por datos reales de la municipalidad.
export const places: Place[] = [
  // Gastronomía
  { id: 'fogon-isleno', category: 'gastronomia', title: 'Cocinería El Fogón Isleño', area: 'Achao', tag: 'Mariscos', image: photos.food, note: 'Abierto hasta las 21:00', description: 'Cocinería tradicional con productos del mar y recetas chilotas.', address: 'Costanera de Achao', lat: -42.4712, lng: -73.4905 },
  { id: 'sabores-del-puerto', category: 'gastronomia', title: 'Sabores del Puerto', area: 'Achao', tag: 'Cocina chilota', image: photos.food2, note: 'Abierto ahora', description: 'Platos de la cocina chilota frente al puerto.', address: 'Costanera de Achao', lat: -42.4705, lng: -73.4898 },
  { id: 'mercado-municipal', category: 'gastronomia', title: 'Mercado Municipal', area: 'Achao', tag: 'Productos locales', image: photos.coast, note: 'Cierra a las 18:00', description: 'Productos locales, artesanía y comida típica.', address: 'Achao', lat: -42.4722, lng: -73.4912 },
  // Hospedajes
  { id: 'cabanas-mirador', category: 'hospedajes', title: 'Cabañas Mirador del Canal', area: 'Putique', tag: 'Cabañas', image: photos.cabin, note: 'Desde $65.000 / noche', description: 'Cabañas con vista al canal Dalcahue.', lat: -42.4005, lng: -73.4985 },
  { id: 'hostal-la-minga', category: 'hospedajes', title: 'Hostal La Minga', area: 'Achao', tag: 'Hostal', image: photos.coast, note: 'Desayuno incluido', description: 'Hostal en el centro de Achao.', lat: -42.4698, lng: -73.4893 },
  { id: 'refugio-quinchao', category: 'hospedajes', title: 'Refugio Isla Quinchao', area: 'Palqui', tag: 'Turismo rural', image: photos.hero, note: 'Reserva previa', description: 'Alojamiento de turismo rural.', lat: -42.5105, lng: -73.4602 },
  // Experiencias
  { id: 'iglesia-achao', category: 'experiencias', title: 'Iglesia Santa María de Loreto de Achao', area: 'Achao', tag: 'Patrimonio', image: photos.church, note: 'Mar–Dom · 10:00–18:00', description: 'Construida durante el siglo XVIII, es la iglesia más antigua de Chiloé y una obra maestra de la arquitectura religiosa en madera. Fue declarada Patrimonio de la Humanidad por la UNESCO en el año 2000.', address: 'Progreso 04, Achao', lat: -42.4709, lng: -73.4909 },
  { id: 'kayak-dalcahue', category: 'experiencias', title: 'Kayak por el canal Dalcahue', area: 'Putique', tag: 'Aventura', image: photos.kayak, note: 'Próxima salida 10:30', description: 'Navegación de 3 horas, nivel inicial.', lat: -42.4102, lng: -73.4951 },
  { id: 'ruta-iglesias', category: 'experiencias', title: 'Ruta de las iglesias', area: 'Quinchao', tag: 'Patrimonio', image: photos.church, note: 'Salidas martes y sábado', description: 'Recorrido de día completo con guía.', lat: -42.4455, lng: -73.4370 },
  // Emergencias
  { id: 'hospital-achao', category: 'emergencias', title: 'Hospital Comunitario de Achao', area: 'Achao', tag: 'Salud', image: photos.coast, note: 'Urgencias 24 horas · 131', description: 'Atención de urgencia.', address: 'W-59 251, Achao', phone: '131', lat: -42.4728, lng: -73.4887 },
  { id: 'carabineros-achao', category: 'emergencias', title: 'Carabineros de Achao', area: 'Achao', tag: 'Seguridad', image: photos.hero, note: 'Atención 24 horas · 133', description: 'Tenencia de Carabineros.', address: 'Ramón Freire 20, Achao', phone: '133', lat: -42.4701, lng: -73.4901 },
  { id: 'capitania-puerto', category: 'emergencias', title: 'Capitanía de Puerto', area: 'Achao', tag: 'Emergencia marítima', image: photos.coast, note: 'Emergencias · 137', description: 'Emergencias marítimas.', address: 'Costanera s/n', phone: '137', lat: -42.4708, lng: -73.4915 },
  // Reciclaje
  { id: 'punto-limpio-costanera', category: 'reciclaje', title: 'Punto Limpio Costanera', area: 'Achao', tag: 'Papel · Vidrio · Latas', image: photos.coast, note: 'Disponible 24 horas', description: 'Contenedores de papel, vidrio y latas.', address: 'Costanera de Achao', lat: -42.4715, lng: -73.4908 },
  { id: 'estacion-verde-putique', category: 'reciclaje', title: 'Estación Verde Putique', area: 'Putique', tag: 'Plásticos PET · Cartón', image: photos.church, note: 'Lun–Sáb · 09:00–18:00', description: 'Recepción de plásticos PET y cartón.', address: 'Sede vecinal Putique', lat: -42.4012, lng: -73.4978 },
  { id: 'acopio-municipal', category: 'reciclaje', title: 'Punto de acopio municipal', area: 'Achao', tag: 'Electrónicos · Pilas', image: photos.hero, note: 'Solo días hábiles', description: 'Recepción de residuos electrónicos y pilas.', address: 'Av. 21 de Mayo 01', lat: -42.4735, lng: -73.4875 },
];

export const getPlace = (id: string) => places.find((p) => p.id === id);
export const placesByCategory = (key: string) => places.filter((p) => p.category === key);
