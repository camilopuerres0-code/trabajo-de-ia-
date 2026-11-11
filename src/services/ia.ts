// src/services/ia.ts — código del NAVEGADOR: no contiene ninguna clave
import type { Indicator } from '../types/index';

// Traduce los códigos HTTP a mensajes que entiende el usuario (exportada para reutilizarla)
export function mensajeSegunEstado(status: number): string {
  if (status === 404) {
    return 'No se encontró el backend. ¿Ejecutaste "npm run dev" desde la carpeta del proyecto (que incluye la carpeta api/)?';
  }
  if (status === 400) return 'Los datos enviados no son válidos.';
  if (status === 429) return 'Hay muchas solicitudes. Espera un poco e intenta de nuevo.';
  if (status === 503) return 'El servicio de IA está ocupado. Espera un minuto e inténtalo de nuevo.';
  return 'El servicio de IA no está disponible. Intenta más tarde.';
}

export async function analizarIndicadores(
  indicadores: Indicator[],
  signal?: AbortSignal,
): Promise<string> {
  let res: Response;
  try {
    // Llamamos a NUESTRO backend, nunca directamente al proveedor
    res = await fetch('/api/analizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ indicadores }),
      signal, // permite cancelar la petición (por ejemplo, por tiempo máximo)
    });
  } catch {
    if (signal?.aborted) {
      if (signal.reason instanceof DOMException && signal.reason.name === 'TimeoutError') {
        throw new Error('El análisis está tardando más de lo esperado. Intenta de nuevo en un momento.');
      }
      throw new Error('El análisis fue cancelado.');
    }
    throw new Error('No se pudo conectar con el servicio de IA. Revisa tu conexión e inténtalo de nuevo.');
  }

  // Recuerda: fetch NO lanza error con 4xx o 5xx; hay que revisar res.ok
  if (!res.ok) throw new Error(mensajeSegunEstado(res.status));

  const datos = await res.json();
  return datos.texto;
}
