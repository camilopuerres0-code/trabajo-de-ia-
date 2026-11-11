// api/_adaptadores.ts — se ejecuta en el SERVIDOR (Vercel Function o servidor local de Vite), nunca en el navegador
export type MensajeIA = { rol: 'user' | 'assistant'; contenido: string };

const PROVEEDOR = process.env.PROVEEDOR ?? 'gemini';
const CLAVE = process.env.IA_API_KEY;
const MODELO = process.env.IA_MODELO;

export class ServicioIAOcupado extends Error {}

// Convierte la lista de indicadores en texto plano para incluirlo en el prompt
export function formatearIndicadores(indicadores: any[]): string {
  return indicadores
    .slice(0, 30) // como máximo 30 indicadores
    .map((i) => `- ${String(i.metric).slice(0, 60)}: ${String(i.value).slice(0, 20)}`
      + ` (estado: ${String(i.status).slice(0, 15)})`)
    .join('\n');
}

// Envía las instrucciones y los mensajes al proveedor elegido y devuelve SOLO el texto
export async function consultarIA(
  instrucciones: string,
  mensajes: MensajeIA[],
): Promise<string> {
  if (!CLAVE || !MODELO) throw new Error('Faltan las variables IA_API_KEY o IA_MODELO');

  // ---------- OpenAI (Responses API) ----------
  if (PROVEEDOR === 'openai') {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
      body: JSON.stringify({
        model: MODELO,
        instructions: instrucciones,
        input: mensajes.map((m) => ({ role: m.rol, content: m.contenido })),
      }),
    });
    if (!r.ok) throw new Error(`OpenAI respondió ${r.status}: ${await r.text()}`);
    const datos = await r.json();
    // El texto está en output → message → content → output_text
    return (datos.output ?? [])
      .filter((item: any) => item.type === 'message')
      .flatMap((item: any) => item.content)
      .filter((parte: any) => parte.type === 'output_text')
      .map((parte: any) => parte.text)
      .join('');
  }

  // ---------- Google (Gemini API) ----------
  if (PROVEEDOR === 'gemini') {
    const base = 'https://generativelanguage.googleapis.com/v1beta/models';
    const modelos = [...new Set([MODELO, 'gemini-flash-latest', 'gemini-3.1-flash-lite'])];
    let ultimoError: Error | undefined;

    for (const modelo of modelos) {
      try {
        const r = await fetch(`${base}/${modelo}:generateContent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': CLAVE },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: instrucciones }] },
            contents: mensajes.map((m) => ({
              role: m.rol === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.contenido }],
            })),
            generationConfig: { maxOutputTokens: 512 },
          }),
          signal: AbortSignal.timeout(20_000),
        });

        if (!r.ok) {
          const detalle = await r.text();
          ultimoError = new Error(`Gemini respondió ${r.status}: ${detalle}`);
          if ([404, 429, 500, 502, 503, 504].includes(r.status)) continue;
          throw ultimoError;
        }

        const datos = await r.json();
        const texto = datos.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ?? '';
        if (texto) return texto;
        throw new Error('Gemini no devolvió texto para el análisis');
      } catch (error) {
        if (error === ultimoError) {
          if ([404, 429, 500, 502, 503, 504].some((status) =>
            ultimoError?.message.includes(`Gemini respondió ${status}`))) continue;
          throw error;
        }
        if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'TypeError')) {
          ultimoError = error;
          continue;
        }
        throw error;
      }
    }

    if (ultimoError?.message.includes('Gemini respondió 429')
      || ultimoError?.message.includes('Gemini respondió 503')) {
      throw new ServicioIAOcupado('Gemini sigue ocupado después de probar modelos alternativos');
    }
    throw ultimoError ?? new Error('Gemini no respondió');
  }

  // ---------- Hugging Face (formato Chat Completions) ----------
  const r = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CLAVE}` },
    body: JSON.stringify({
      model: MODELO,
      messages: [
        { role: 'system', content: instrucciones },
        ...mensajes.map((m) => ({ role: m.rol, content: m.contenido })),
      ],
    }),
  });
  if (!r.ok) throw new Error(`Hugging Face respondió ${r.status}: ${await r.text()}`);
  const datos = await r.json();
  // El texto está en choices[0].message.content
  return datos.choices?.[0]?.message?.content ?? '';
}
