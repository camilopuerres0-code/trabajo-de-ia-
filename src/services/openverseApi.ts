// src/services/openverseApi.ts
// Consumo de una API externa real con Fetch (Tema 4).
// Openverse es un buscador de medios con licencia Creative Commons;
// su endpoint de búsqueda de imágenes es público y no requiere API key.
import type { HerbicidaImagen } from '../types/index';

const BASE_URL = 'https://api.openverse.org/v1/images/';

// Forma "cruda" de cada resultado tal como lo entrega la API
interface OpenverseResultadoRaw {
  id: string;
  title: string | null;
  url: string;
  thumbnail: string;
  creator: string | null;
  license: string;
  foreign_landing_url: string;
}

interface OpenverseRespuesta {
  result_count: number;
  results: OpenverseResultadoRaw[];
}

export async function buscarImagenesHerbicidas(
  consulta: string,
  signal?: AbortSignal
): Promise<HerbicidaImagen[]> {
  const params = new URLSearchParams({
    q: consulta,
    page_size: '12',
    mature: 'false',
  });

  const respuesta = await fetch(`${BASE_URL}?${params.toString()}`, { signal });

  if (!respuesta.ok) {
    throw new Error(`La API respondió con error ${respuesta.status}`);
  }

  const datos: OpenverseRespuesta = await respuesta.json();

  // Normalizamos la respuesta externa a nuestro propio tipo (HerbicidaImagen),
  // así el resto de la app nunca depende de la forma exacta de la API externa.
  return datos.results.map((item) => ({
    id: item.id,
    titulo: item.title?.trim() || 'Herbicida',
    urlCompleta: item.url,
    miniatura: item.thumbnail,
    autor: item.creator?.trim() || 'Autor desconocido',
    licencia: item.license.toUpperCase(),
    enlaceOrigen: item.foreign_landing_url,
  }));
}
