// src/data/contenido.ts
import type { Banner, HerbicidaFicha, ItemInfo, NivelRiesgo, TemaGaleria } from '../types/index';

// Semáforo accesible (informe, principio Perceptible): color + palabra + ícono
export const ICONO_NIVEL: Record<NivelRiesgo, string> = { Bajo: '✔', Medio: '⚠', Alto: '✖', Crítico: '☠' };

export const BANNERS: Banner[] = [
  { icono: '🧤', titulo: 'Fumigue con seguridad', texto: 'Use guantes, mascarilla y gafas antes de preparar la mezcla.', color: '#2e7d32' },
  { icono: '💨', titulo: 'No fumigue con viento', texto: 'La deriva puede llegar a su familia y a los cultivos vecinos.', color: '#b45309' },
  { icono: '💧', titulo: 'Cuide el agua', texto: 'Mantenga los herbicidas lejos de quebradas, pozos y nacederos.', color: '#0369a1' },
  { icono: '🏷️', titulo: 'Lea la etiqueta', texto: 'Respete siempre la dosis recomendada por el fabricante.', color: '#7c2d12' },
];

export const FICHAS: HerbicidaFicha[] = [
  { nombre: 'Glifosato', tipo: 'Sistémico', uso: 'Control de malezas en general; se absorbe por las hojas.', peligro: 'Irrita ojos y piel; dañino para la vida acuática.', precaucion: 'No aplicar cerca de fuentes de agua.' },
  { nombre: '2,4-D', tipo: 'Hormonal selectivo', uso: 'Control de malezas de hoja ancha en gramíneas.', peligro: 'Irritante; la deriva puede dañar cultivos vecinos.', precaucion: 'No fumigar con viento.' },
  { nombre: 'Atrazina', tipo: 'Triazínico', uso: 'Preemergente en cultivos como maíz y caña.', peligro: 'Persistente; puede llegar a aguas subterráneas.', precaucion: 'Evitar suelos arenosos y zonas cercanas a pozos.' },
  { nombre: 'Paraquat', tipo: 'De contacto', uso: 'Quema rápida del follaje de malezas.', peligro: 'Muy tóxico: puede ser mortal si se ingiere o inhala.', precaucion: 'Equipo completo, guardar bajo llave; verifique la normativa local.' },
  { nombre: 'Diurón', tipo: 'Uréico residual', uso: 'Control residual de malezas antes de que broten.', peligro: 'Persiste en suelo y agua; tóxico para organismos acuáticos.', precaucion: 'Evitar que la escorrentía llegue a quebradas.' },
];

export const PELIGROS: ItemInfo[] = [
  { icono: '🫁', titulo: 'Salud del aplicador', texto: 'Los herbicidas entran por la piel, la nariz y la boca. Puede haber mareo, náuseas e irritación.' },
  { icono: '💧', titulo: 'Contaminación del agua', texto: 'La lluvia arrastra el producto a quebradas y pozos, afectando peces y agua de consumo.' },
  { icono: '🐝', titulo: 'Suelo y biodiversidad', texto: 'Se afectan microorganismos del suelo, abejas y otros polinizadores que ayudan al cultivo.' },
  { icono: '👨‍👩‍👧', titulo: 'Familia y animales', texto: 'Guarde los envases cerrados, lejos de niños y animales. Nunca reutilice los envases.' },
];

export const HERRAMIENTAS: ItemInfo[] = [
  { icono: '🧤', titulo: 'Guantes de nitrilo', texto: 'Protegen las manos al preparar y aplicar la mezcla.', grupo: 'Protección' },
  { icono: '😷', titulo: 'Mascarilla con filtro', texto: 'Evita respirar vapores y gotas finas.', grupo: 'Protección' },
  { icono: '🥽', titulo: 'Gafas de protección', texto: 'Cuidan los ojos de salpicaduras.', grupo: 'Protección' },
  { icono: '🥾', titulo: 'Botas y overol', texto: 'Cubren piel y ropa; lávelos aparte después de fumigar.', grupo: 'Protección' },
  { icono: '🎒', titulo: 'Bomba de espalda', texto: 'Debe estar calibrada y sin fugas para aplicar la dosis correcta.', grupo: 'Cultivo' },
  { icono: '🧪', titulo: 'Recipiente medidor', texto: 'Mide con exactitud el producto y el agua de la mezcla.', grupo: 'Cultivo' },
  { icono: '⛏️', titulo: 'Azadón y pala', texto: 'Alternativa mecánica para controlar malezas sin químicos.', grupo: 'Cultivo' },
  { icono: '🔪', titulo: 'Machete y guadaña', texto: 'Para chapear y reducir la cantidad de herbicida necesaria.', grupo: 'Cultivo' },
];

export const TEMAS_GALERIA: TemaGaleria[] = [
  { etiqueta: 'Glifosato', consulta: 'glyphosate herbicide' },
  { etiqueta: 'Atrazina', consulta: 'atrazine herbicide' },
  { etiqueta: 'Paraquat', consulta: 'paraquat herbicide' },
  { etiqueta: 'Fumigación', consulta: 'crop spraying farmer' },
  { etiqueta: 'Malezas', consulta: 'weeds crop field' },
];
