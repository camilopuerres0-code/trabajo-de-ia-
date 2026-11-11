// src/componentes/Toast/Toast.tsx
import { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
  mensaje: string | null;
  onCerrar: () => void;
}

export const Toast = ({ mensaje, onCerrar }: ToastProps) => {
  // Efecto secundario: el toast se cierra solo después de un momento
  useEffect(() => {
    if (!mensaje) return;
    const temporizador = setTimeout(onCerrar, 2400);
    return () => clearTimeout(temporizador);
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;

  return (
    <div className={styles.toast} role="status">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.icono}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {mensaje}
    </div>
  );
};
