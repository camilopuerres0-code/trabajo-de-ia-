// src/types/index.ts
// Tipado estricto con TypeScript (Tema 2): aquí definimos los "contratos"
// de datos que usará toda la aplicación.

// Claves válidas de herbicida (evita errores de escritura en toda la app)
export type HerbicidaKey = 'glifosato' | '24d' | 'atrazina' | 'paraquat' | 'diuron';

// Información fija de cada herbicida
export interface HerbicidaInfo {
  nombre: string;
  descripcion: string;
  factorToxicidad: number;
  umbralSeguro: number;
}

// Niveles de riesgo posibles (valores estrictos, igual que MetricaProyecto de la guía)
export type NivelRiesgo = 'Bajo' | 'Medio' | 'Alto' | 'Crítico';

// Resultado calculado a partir de los datos del formulario
export interface ResultadoRiesgo {
  nivel: NivelRiesgo;
  clase: string;
  mensaje: string;
  indiceExposicion: number;
  dosisTotal: number;
}

// Un registro histórico guardado (resultado + datos que lo originaron)
export interface RegistroRiesgo extends ResultadoRiesgo {
  id: number;
  herbicida: string;
  concentracion: number;
  area: number;
  fecha: string;
}

// Las vistas que tendrá la SPA (se quitó la vista de "Documentación API")
export type Vista = 'calculadora' | 'registros' | 'herbicidas' | 'info';

// Imagen de herbicida ya normalizada desde la respuesta de la API de Openverse
export interface HerbicidaImagen {
  id: string;
  titulo: string;
  urlCompleta: string;
  miniatura: string;
  autor: string;
  licencia: string;
  enlaceOrigen: string;
}

// Estado de una petición asíncrona (Tema 4: carga, error o datos)
export interface EstadoBusquedaImagenes {
  cargando: boolean;
  error: string | null;
  imagenes: HerbicidaImagen[];
}

// Contenido informativo (banners, fichas, peligros, herramientas, temas de galería)
export interface HerbicidaFicha { nombre: string; tipo: string; uso: string; peligro: string; precaucion: string; }
export interface ItemInfo { icono: string; titulo: string; texto: string; grupo?: string; }
export interface Banner { icono: string; titulo: string; texto: string; color: string; }
export interface TemaGaleria { etiqueta: string; consulta: string; }

// Clima actual de una ciudad (Tema 4: segunda API, consumida con Axios)
export interface ClimaCiudad {
  ciudad: string;
  temperatura: number;
  viento: number;
  humedad: number;
}

// Unidad 3 · Tema 2: dato que se envía al Analista IA (contrato con /api/analizar)
export interface Indicator {
  metric: string;
  value: string | number;
  status: string;
}
