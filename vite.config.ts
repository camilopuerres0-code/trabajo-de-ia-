import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Backend local para el Analista IA (Unidad 3 · Tema 2).
// Ejecuta el manejador Edge de api/analizar.ts en la ruta /api/analizar,
// pero dentro de `npm run dev`, sin necesidad de `vercel dev` ni `vercel link`.
// Las variables (PROVEEDOR, IA_API_KEY, IA_MODELO) se leen de .env.local, y viven
// solo en el servidor: nunca llegan al navegador porque no empiezan por VITE_.
function apiLocal(): Plugin {
  return {
    name: 'api-local',
    configureServer(server) {
      Object.assign(process.env, loadEnv(server.config.mode, server.config.root, ''))

      server.middlewares.use('/api/analizar', async (req, res) => {
        try {
          const chunks: Buffer[] = []
          for await (const chunk of req) chunks.push(chunk as Buffer)
          const cuerpo = Buffer.concat(chunks)

          const request = new Request(`http://localhost${req.originalUrl ?? '/api/analizar'}`, {
            method: req.method,
            headers: { 'Content-Type': 'application/json' },
            body: req.method === 'GET' || req.method === 'HEAD' ? undefined : cuerpo,
          })

          const modulo = await server.ssrLoadModule('/api/analizar.ts')
          const respuesta: Response = await modulo.default(request)

          res.statusCode = respuesta.status
          res.setHeader('Content-Type', 'application/json')
          res.end(await respuesta.text())
        } catch (error) {
          console.error(error)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'El servicio de IA no respondió' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiLocal()],
  // Tema 5: optimización del build (separa librerías en un chunk propio)
  build: {
    rollupOptions: {
      output: { manualChunks: { vendor: ['react', 'react-dom', 'axios'] } },
    },
  },
  // host: true -> el servidor escucha en toda la red local (0.0.0.0),
  // así el celular puede abrir la app con la IP del computador.
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
})
