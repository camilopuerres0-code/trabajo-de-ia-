// src/utils/calculoRiesgo.ts
import type { HerbicidaKey, ResultadoRiesgo } from '../types/index';
import { HERBICIDAS } from '../data/herbicidas';

export function calcularRiesgo(
  concentracion: number,
  area: number,
  herbicidaKey: HerbicidaKey
): ResultadoRiesgo {
  const herbicida = HERBICIDAS[herbicidaKey];
  const indiceExposicion = concentracion * area * herbicida.factorToxicidad;
  const dosisTotal = concentracion * area * 10000;
  const ratio = indiceExposicion / herbicida.umbralSeguro;

  if (ratio <= 0.5) {
    return {
      nivel: 'Bajo',
      clase: 'nivel-bajo',
      mensaje: `El impacto ambiental estimado es bajo. La exposición de ${herbicida.nombre} está dentro de rangos seguros para el área evaluada.`,
      indiceExposicion,
      dosisTotal,
    };
  }

  if (ratio <= 1.0) {
    return {
      nivel: 'Medio',
      clase: 'nivel-medio',
      mensaje: `Riesgo moderado detectado. Se recomienda monitorear la aplicación de ${herbicida.nombre} y considerar reducir la concentración o el área tratada.`,
      indiceExposicion,
      dosisTotal,
    };
  }

  if (ratio <= 2.0) {
    return {
      nivel: 'Alto',
      clase: 'nivel-alto',
      mensaje: `Riesgo elevado. La combinación de concentración y área supera los umbrales seguros para ${herbicida.nombre}. Revise las prácticas de aplicación.`,
      indiceExposicion,
      dosisTotal,
    };
  }

  return {
    nivel: 'Crítico',
    clase: 'nivel-critico',
    mensaje: `Riesgo crítico. Se detecta un impacto ambiental potencialmente severo. Suspender o replantear la aplicación de ${herbicida.nombre} inmediatamente.`,
    indiceExposicion,
    dosisTotal,
  };
}

export function formatearNumero(num: number, decimales = 2): string {
  return num.toLocaleString('es-CO', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  });
}
