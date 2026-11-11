// src/componentes/HerbicidasView/HerbicidasView.tsx
import { useState } from 'react';
import type { HerbicidaImagen } from '../../types/index';
import { useImagenesHerbicidas } from '../../hooks/useImagenesHerbicidas';
import { ImagenCard } from '../ImagenCard/ImagenCard';
import { ImagenModal } from '../ImagenModal/ImagenModal';
import { TEMAS_GALERIA } from '../../data/contenido';
import styles from './HerbicidasView.module.css';

interface HerbicidasViewProps {
  consultaInicial: string;
}

export const HerbicidasView = ({ consultaInicial }: HerbicidasViewProps) => {
  const [consulta, setConsulta] = useState(consultaInicial);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<HerbicidaImagen | null>(null);
  const { cargando, error, imagenes } = useImagenesHerbicidas(consulta);

  return (
    <section>
      <h1 className={styles.title}>Herbicidas</h1>
      <p className={styles.subtitle}>
        Imágenes de herbicidas y su aplicación en campo, consultadas en tiempo real desde la API
        pública de Openverse.
      </p>

      <div className={styles.buscadorWrap}>
        <svg
          className={styles.buscadorIcono}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className={styles.buscador}
          placeholder="Buscar herbicida (ej. glifosato, atrazina)"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
        />
      </div>

      <div className={styles.chips}>
        {TEMAS_GALERIA.map((t) => (
          <button key={t.etiqueta} type="button" className={`${styles.chip} ${consulta === t.consulta ? styles.activo : ''}`} onClick={() => setConsulta(t.consulta)}>
            {t.etiqueta}
          </button>
        ))}
      </div>

      {cargando && (
        <div className={styles.grid} aria-busy="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!cargando && error && (
        <p className={styles.errorTexto} role="alert">
          {error}
        </p>
      )}

      {!cargando && !error && consulta.trim() !== '' && imagenes.length === 0 && (
        <p className={styles.emptyState}>No se encontraron imágenes para "{consulta}".</p>
      )}

      {!cargando && !error && consulta.trim() === '' && (
        <p className={styles.emptyState}>Escribe un término para buscar imágenes.</p>
      )}

      {!cargando && !error && imagenes.length > 0 && (
        <div className={styles.grid}>
          {imagenes.map((imagen) => (
            <ImagenCard key={imagen.id} imagen={imagen} onClick={setImagenSeleccionada} />
          ))}
        </div>
      )}

      <ImagenModal imagen={imagenSeleccionada} onCerrar={() => setImagenSeleccionada(null)} />

      <p className={styles.creditos}>
        Imágenes con licencia Creative Commons vía{' '}
        <a href="https://openverse.org" target="_blank" rel="noopener noreferrer">
          Openverse
        </a>
        .
      </p>
    </section>
  );
};
