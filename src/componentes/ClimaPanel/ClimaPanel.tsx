// src/componentes/ClimaPanel/ClimaPanel.tsx
import { useState } from 'react';
import type { ClimaCiudad } from '../../types/index';
import { consultarClimaCiudades } from '../../services/climaApi';
import styles from './ClimaPanel.module.css';

// Viento > 15 km/h favorece la deriva del herbicida hacia cultivos vecinos
const VIENTO_MAXIMO = 15;

export const ClimaPanel = () => {
  const [clima, setClima] = useState<ClimaCiudad[]>([]);
  const [cargandoApi, setCargandoApi] = useState(false);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  // async/await + try/catch/finally (Tema 4)
  async function consultarClima() {
    setCargandoApi(true);
    setErrorApi(null);
    try {
      setClima(await consultarClimaCiudades());
    } catch {
      setErrorApi('No se pudo conectar con la API del clima. Verifique su red.');
    } finally {
      setCargandoApi(false); // se desactiva la carga pase lo que pase
    }
  }

  return (
    <section className={styles.panel}>
      <h2 className={styles.titulo}>Clima para aplicar</h2>
      <p className={styles.texto}>Consulte el viento actual antes de fumigar (API Open-Meteo vía Axios).</p>

      <button type="button" className={styles.boton} onClick={consultarClima} disabled={cargandoApi}>
        {cargandoApi ? 'Consultando API...' : 'Consultar clima'}
      </button>

      {errorApi && <p className={styles.error} role="alert">{errorApi}</p>}

      {clima.length > 0 && (
        <ul className={styles.lista}>
          {clima.map((c) => {
            const apto = c.viento <= VIENTO_MAXIMO;
            return (
              <li key={c.ciudad} className={styles.item}>
                <strong>{c.ciudad}</strong>
                <span>{c.temperatura} °C · {c.humedad}% hum. · viento {c.viento} km/h</span>
                <span className={apto ? styles.apto : styles.noApto}>
                  {apto ? 'Apto para aplicar' : 'Viento alto: riesgo de deriva'}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
