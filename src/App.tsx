// src/App.tsx
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import type { Indicator, RegistroRiesgo, Vista } from './types/index';
import { Header } from './componentes/Header/Header';
import { BottomNav } from './componentes/BottomNav/BottomNav';
import { CalculadoraForm } from './componentes/CalculadoraForm/CalculadoraForm';
import { ResultadoRiesgo } from './componentes/ResultadoRiesgo/ResultadoRiesgo';
const RegistrosView = lazy(() => import('./componentes/RegistrosView/RegistrosView').then((m) => ({ default: m.RegistrosView })));
const HerbicidasView = lazy(() => import('./componentes/HerbicidasView/HerbicidasView').then((m) => ({ default: m.HerbicidasView })));
import { BannerCarrusel } from './componentes/BannerCarrusel/BannerCarrusel';
const InfoView = lazy(() => import('./componentes/InfoView/InfoView').then((m) => ({ default: m.InfoView })));
import { ClimaPanel } from './componentes/ClimaPanel/ClimaPanel';
import { PanelIA } from './componentes/PanelIA/PanelIA';
import { Toast } from './componentes/Toast/Toast';
import { useRegistros } from './hooks/useRegistros';
import './App.css';

type ResultadoActual = Omit<RegistroRiesgo, 'id' | 'fecha'>;

export default function App() {
  const [vista, setVista] = useState<Vista>('calculadora');
  const [resultado, setResultado] = useState<ResultadoActual | null>(null);
  const [consultaHerbicidas, setConsultaHerbicidas] = useState('herbicida aplicación agrícola');
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);
  const [escala, setEscala] = useState(100);
  const [enLinea, setEnLinea] = useState(navigator.onLine);
  const { registros, agregarRegistro, limpiarRegistros } = useRegistros();

  // Unidad 3 · Tema 2: los últimos cálculos se convierten en "indicadores" para el Analista IA
  const indicadoresIA = useMemo<Indicator[]>(
    () =>
      registros.slice(0, 30).map((r) => ({
        metric: `${r.herbicida} ${r.concentracion} mg/l, ${r.area} ha`,
        value: `índice ${r.indiceExposicion.toFixed(1)}`,
        status: r.nivel,
      })),
    [registros],
  );

  // Tamaño de texto ajustable (accesibilidad) y detección de conexión (modo sin internet)
  useEffect(() => {
    document.documentElement.style.fontSize = `${escala}%`;
  }, [escala]);

  useEffect(() => {
    const on = () => setEnLinea(true);
    const off = () => setEnLinea(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  function manejarResultado(datos: ResultadoActual) {
    setResultado(datos);
    agregarRegistro(datos);
    setMensajeToast('Registro guardado correctamente');
  }

  function irAHerbicidas() {
    // Si ya hay un resultado calculado, se usa el nombre del herbicida
    // evaluado como término de búsqueda inicial (props hacia una vista distinta).
    if (resultado) {
      setConsultaHerbicidas(`herbicida ${resultado.herbicida}`);
    }
    setVista('herbicidas');
  }

  return (
    <div className="app">
      <Header onTexto={(d) => setEscala((e) => Math.min(140, Math.max(90, e + d)))} />

      {/* key={vista} reinicia la animación de entrada cada vez que se cambia de vista */}
      <main className="main">
        {!enLinea && <p className="offline">Sin conexión: puede seguir calculando. Sus registros se guardan en el teléfono.</p>}
        {vista !== 'registros' && <BannerCarrusel />}
        <Suspense fallback={<p className="subtitle">Cargando...</p>}>
        <div className="vistaAnimada" key={vista}>
          {vista === 'calculadora' && (
            <section>
              <h1 className="title">Calculadora de Riesgo</h1>
              <p className="subtitle">
                Ingrese los parámetros del herbicida para evaluar el impacto ambiental potencial.
              </p>
              <div className="calcGrid">
                <CalculadoraForm onResultado={manejarResultado} />
                <ResultadoRiesgo resultado={resultado} onVerHerbicida={irAHerbicidas} />
              </div>
              {/* Unidad 3 · Tema 2: análisis con IA de los cálculos actuales */}
              <PanelIA indicadores={indicadoresIA} />
              <ClimaPanel />
            </section>
          )}

          {vista === 'registros' && (
            <RegistrosView registros={registros} onLimpiar={limpiarRegistros} />
          )}

          {vista === 'info' && <InfoView />}

          {vista === 'herbicidas' && (
            <HerbicidasView consultaInicial={consultaHerbicidas} />
          )}
        </div>
        </Suspense>
      </main>

      <Toast mensaje={mensajeToast} onCerrar={() => setMensajeToast(null)} />
      <BottomNav vistaActiva={vista} onCambiarVista={setVista} />
    </div>
  );
}
