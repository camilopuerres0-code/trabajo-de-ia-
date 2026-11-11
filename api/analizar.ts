// api/analizar.ts — responde en la ruta /api/analizar
import { consultarIA, formatearIndicadores, ServicioIAOcupado } from './_adaptadores.js';

// Instrucciones para el modelo, adaptadas al dominio de TerraSur (herbicidas)
const INSTRUCCIONES = `Eres un asesor agrícola que apoya a pequeños productores de Nariño, Colombia, sin formación técnica.
Recibirás el historial de cálculos de riesgo ambiental de herbicidas entre las etiquetas <datos></datos>.
Cada línea trae el herbicida, la concentración (mg/l), el área (hectáreas), el índice de exposición y el nivel de riesgo (Bajo, Medio, Alto o Crítico).
Responde en español y en máximo 4 frases:
1) resume el estado general, 2) señala el cálculo que requiere más atención
y 3) sugiere una acción concreta y segura (por ejemplo reducir la concentración o el área tratada).
Usa SOLO la información de <datos>; si falta algo, dilo con claridad.`;

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Método no permitido' }, { status: 405 });
  }

  // 1. Leer y validar lo que envía el navegador
  let indicadores: any; // any: se valida justo debajo
  try {
    ({ indicadores } = await request.json());
  } catch {
    return Response.json({ error: 'El cuerpo debe ser JSON' }, { status: 400 });
  }
  const valido =
    Array.isArray(indicadores) && indicadores.length > 0 && indicadores.length <= 30;
  if (!valido) {
    return Response.json({ error: 'Envía entre 1 y 30 indicadores' }, { status: 400 });
  }

  // 2. Consultar al proveedor y devolver siempre el mismo formato: { texto }
  try {
    const datos = formatearIndicadores(indicadores);
    const texto = await consultarIA(INSTRUCCIONES, [
      { rol: 'user', contenido: `<datos>\n${datos}\n</datos>` },
    ]);
    return Response.json({ texto });
  } catch (error) {
    // El detalle se ve en la terminal o en los logs de Vercel, NO en el navegador
    console.error(error);
    if (error instanceof ServicioIAOcupado) {
      return Response.json(
        { error: 'El servicio de IA está muy ocupado. Espera un minuto e inténtalo de nuevo.' },
        { status: 503 },
      );
    }
    return Response.json({ error: 'El servicio de IA no respondió' }, { status: 502 });
  }
}
