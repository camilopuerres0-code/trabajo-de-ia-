// src/componentes/Header/Header.tsx
import styles from './Header.module.css';

// Componente de presentación puro: no recibe props porque el
// encabezado siempre muestra lo mismo (marca de la aplicación).
interface HeaderProps {
  onTexto: (delta: number) => void;
}

export const Header = ({ onTexto }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerBrand}>
        <div className={styles.logoIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C12 2 6 8 6 14C6 17.31 8.69 20 12 20C15.31 20 18 17.31 18 14C18 8 12 2 12 2Z"
              fill="white"
            />
            <path d="M12 20V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className={styles.marca}>
          <span className={styles.brandName}>TerraSur</span>
          <span className={styles.lema}>Fumigue sabiendo el riesgo</span>
        </div>
      </div>
      <div className={styles.texto}>
        <button type="button" aria-label="Reducir texto" onClick={() => onTexto(-10)}>A-</button>
        <button type="button" aria-label="Aumentar texto" onClick={() => onTexto(10)}>A+</button>
      </div>
    </header>
  );
};
