// src/hooks/useImagenesHerbicidas.ts
import { useEffect, useRef, useState } from 'react';
import type { EstadoBusquedaImagenes } from '../types/index';
import { buscarImagenesHerbicidas } from '../services/openverseApi';

const RETRASO_DEBOUNCE_MS = 450;

// Hook reutilizable: recibe el texto de búsqueda y devuelve
// { cargando, error, imagenes }, listo para pintar en la interfaz.
export function useImagenesHerbicidas(consulta: string): EstadoBusquedaImagenes {
  const [estado, setEstado] = useState<EstadoBusquedaImagenes>({                                           //guarda un dato y se actualiza
    cargando: false,
    error: null,
    imagenes: [],
  });
  const controladorRef = useRef<AbortController | null>(null);                                                    //guarda un valor 

  useEffect(() => {                                                                                        //ejecuta el codigo en segundo plano 
    const consultaLimpia = consulta.trim();

    if (!consultaLimpia) {
      setEstado({ cargando: false, error: null, imagenes: [] });
      return;
    }

    // Debounce: esperamos a que el usuario deje de escribir antes de consultar
    const temporizador = setTimeout(() => {
      // Cancela la petición anterior si el usuario siguió escribiendo
      controladorRef.current?.abort();
      const controlador = new AbortController();
      controladorRef.current = controlador;

      setEstado((prev) => ({ ...prev, cargando: true, error: null }));

      buscarImagenesHerbicidas(consultaLimpia, controlador.signal)
        .then((imagenes) => setEstado({ cargando: false, error: null, imagenes }))
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') return;
          setEstado({
            cargando: false,
            error: 'No se pudieron cargar las imágenes. Verifica tu conexión e intenta de nuevo.',
            imagenes: [],
          });
        });
    }, RETRASO_DEBOUNCE_MS);

    return () => clearTimeout(temporizador);
  }, [consulta]);

  return estado;
}
