// src/componentes/BottomNav/BottomNav.tsx
import type { Vista } from '../../types/index';
import styles from './BottomNav.module.css';

// Props tipadas: qué vista está activa y una función callback
// para avisarle a App.tsx que el usuario quiere cambiar de vista.
interface BottomNavProps {
  vistaActiva: Vista;
  onCambiarVista: (vista: Vista) => void;
}

export const BottomNav = ({ vistaActiva, onCambiarVista }: BottomNavProps) => {
  return (
    <nav className={styles.bottomNav}>
      <button
        type="button"
        className={`${styles.navItem} ${vistaActiva === 'calculadora' ? styles.active : ''}`}
        onClick={() => onCambiarVista('calculadora')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <span>Calcular</span>
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${vistaActiva === 'info' ? styles.active : ''}`}
        onClick={() => onCambiarVista('info')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="11" x2="12" y2="16" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Info</span>
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${vistaActiva === 'herbicidas' ? styles.active : ''}`}
        onClick={() => onCambiarVista('herbicidas')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v6" />
          <path d="M9 8h6l1.5 4.5a5 5 0 1 1-9 0Z" />
          <path d="M9 13h6" />
        </svg>
        <span>Galería</span>
      </button>

      <button
        type="button"
        className={`${styles.navItem} ${vistaActiva === 'registros' ? styles.active : ''}`}
        onClick={() => onCambiarVista('registros')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        <span>Registros</span>
      </button>
    </nav>
  );
};
