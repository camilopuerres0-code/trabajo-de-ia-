# TerraSur – Calculadora de riesgo de herbicidas (React + TypeScript + Vite)

## Cómo ejecutarlo en el computador
1. Descomprime este zip en una carpeta NUEVA y vacía (por ejemplo `Desktop\TerraSur`).
   Dentro deben verse directamente `package.json`, `index.html` y la carpeta `src`.
2. Abre esa carpeta en Visual Studio Code (Archivo > Abrir carpeta).
3. Abre la terminal (Terminal > New Terminal) y ejecuta:

       npm install
       npm run dev

4. La terminal mostrará algo así:

       Local:   http://localhost:5173/
       Network: http://192.168.1.25:5173/

   - Abre `Local` en el navegador del computador.
   - Abre `Network` en el celular (ver siguiente sección).

Requiere Node.js 18 o superior (https://nodejs.org).
La galería de herbicidas necesita internet (API pública de Openverse).

## Cómo abrirla en el celular
1. Conecta el celular a la MISMA red Wi-Fi que el computador.
2. Con `npm run dev` corriendo, escribe en el navegador del celular la dirección
   que aparece como `Network` (por ejemplo `http://192.168.1.25:5173/`).
3. Si la terminal no muestra la línea `Network`, busca la IP del computador:
   - Windows: abre una terminal y escribe `ipconfig`; copia el valor de "Dirección IPv4".
   - Luego en el celular abre `http://ESA-IP:5173/`.

### Si no abre en el celular
- Windows pedirá permiso del Firewall la primera vez: marca "Redes privadas" y acepta.
  Si ya lo rechazaste: Configuración de Windows > Firewall > Permitir una aplicación > Node.js.
- Verifica que ambos estén en la misma red Wi-Fi (no datos móviles ni "red de invitados").
- Algunas redes de universidades bloquean la conexión entre dispositivos. En ese caso
  activa "zona Wi-Fi" en el celular y conecta el computador a ella, o usa otra red.
- Si cambia la IP del computador, vuelve a copiar la dirección `Network`.

## Diseño adaptable
- Celular / ventana angosta (< 900 px): vista móvil con barra de navegación inferior.
- Computador (>= 900 px): pantalla completa con menú lateral y dos columnas.

## Despliegue (Tema 5)
    npm run build     # genera la carpeta dist/ optimizada
    npm run preview   # prueba el build de producción en local

La app incluye `vercel.json`, lista para importarse en Vercel (framework Vite, salida `dist`).

## Analista IA (Unidad 3 · Tema 2)
Panel dentro de la calculadora que envía los últimos cálculos de riesgo a un modelo de
lenguaje y muestra un resumen (estado general, cálculo que requiere atención y acción sugerida).

Flujo: React (`src/services/ia.ts`) → función Edge `/api/analizar` (`api/`) → proveedor de IA.
La clave vive solo en el servidor; el navegador nunca la ve.

### Configurar y ejecutar en local (sin Vercel)
1. Instala dependencias: `npm install`
2. Copia `.env.example` como `.env.local` y completa:

       PROVEEDOR=gemini        # gemini, openai o huggingface
       IA_API_KEY=tu_clave     # NUNCA con prefijo VITE_
       IA_MODELO=nombre-del-modelo

3. Ejecuta `npm run dev`. El mismo servidor de Vite atiende `/api/analizar`
   (ver el plugin `apiLocal` en `vite.config.ts`).
4. Si cambias `.env.local`, detén (Ctrl + C) y vuelve a ejecutar `npm run dev`.

Si publicas en Vercel, la carpeta `api/` funciona como Vercel Function y las tres variables
se configuran en Settings → Environment Variables. `.env.local` y `.vercel` están en `.gitignore`.
