// src/componentes/ImagenModal/ImagenModal.tsx
import { useEffect } from 'react';
import type { HerbicidaImagen } from '../../types/index';
import styles from './ImagenModal.module.css';

interface ImagenModalProps {
  imagen: HerbicidaImagen | null;
  onCerrar: () => void;
}

export const ImagenModal = ({ imagen, onCerrar }: ImagenModalProps) => {
  // Efecto secundario: escucha la tecla Escape mientras el modal esté abierto
  useEffect(() => {
    if (!imagen) return;

    function manejarTecla(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar();
    }

    window.addEventListener('keydown', manejarTecla);
    return () => window.removeEventListener('keydown', manejarTecla);
  }, [imagen, onCerrar]);

  // Renderizado condicional: sin imagen seleccionada, no se monta nada
  if (!imagen) return null;

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.contenido} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar imagen">
          ✕
        </button>

        <img src={imagen.urlCompleta} alt={imagen.titulo} className={styles.imagenGrande} />

        <div className={styles.info}>
          <h3 className={styles.tituloModal}>{imagen.titulo}</h3>
          <p className={styles.metaModal}>
            {imagen.autor} · <span className={styles.licencia}>{imagen.licencia}</span>
          </p>
          <a
            href={imagen.enlaceOrigen}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.enlace}
          >
            Ver fuente original ↗
          </a>
        </div>
      </div>
    </div>
  );
};
