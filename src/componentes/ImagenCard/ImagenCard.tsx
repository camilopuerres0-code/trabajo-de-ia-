// src/componentes/ImagenCard/ImagenCard.tsx
import type { HerbicidaImagen } from '../../types/index';
import styles from './ImagenCard.module.css';

interface ImagenCardProps {
  imagen: HerbicidaImagen;
  onClick: (imagen: HerbicidaImagen) => void;
}

// Componente reutilizable: se instancia una vez por cada imagen del arreglo,
// igual que TarjetaItem/RegistroItem, recibiendo sus props tipadas.
export const ImagenCard = ({ imagen, onClick }: ImagenCardProps) => {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onClick(imagen)}
      aria-label={`Ver imagen ampliada: ${imagen.titulo}`}
    >
      <img src={imagen.miniatura} alt={imagen.titulo} loading="lazy" className={styles.thumb} />
      <span className={styles.overlay}>
        <span className={styles.titulo}>{imagen.titulo}</span>
        <span className={styles.autor}>{imagen.autor}</span>
      </span>
    </button>
  );
};
