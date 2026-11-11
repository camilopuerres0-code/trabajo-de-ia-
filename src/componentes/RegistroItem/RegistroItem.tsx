// src/componentes/RegistroItem/RegistroItem.tsx
import type { RegistroRiesgo } from '../../types/index';
import { formatearNumero } from '../../utils/calculoRiesgo';
import { ICONO_NIVEL } from '../../data/contenido';
import styles from './RegistroItem.module.css';

// Componente reutilizable: App/RegistrosView lo instancia una vez por
// cada elemento del arreglo de registros, enviando las props tipadas
// mediante la interfaz RegistroRiesgo (igual que TarjetaItem en la guía).
export const RegistroItem = ({
  herbicida,
  fecha,
  concentracion,
  area,
  indiceExposicion,
  dosisTotal,
  nivel,
  clase,
}: RegistroRiesgo) => {
  const fechaFormateada = new Date(fecha).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={styles.registroCard}>
      <div className={styles.registroCardHeader}>
        <span className={styles.registroHerbicida}>{herbicida}</span>
        <span className={styles.registroFecha}>{fechaFormateada}</span>
      </div>
      <p className={styles.registroInfo}>
        {formatearNumero(concentracion)} mg/l · {formatearNumero(area, 1)} ha
        <br />
        Índice: {formatearNumero(indiceExposicion)} · Dosis: {formatearNumero(dosisTotal, 0)} mg
      </p>
      <span className={`${styles.registroNivel} ${styles[toCamel(clase)]}`}>{ICONO_NIVEL[nivel]} {nivel.toUpperCase()}</span>
    </div>
  );
};

function toCamel(clase: string): string {
  return clase.replace(/-([a-z])/g, (_, letra: string) => letra.toUpperCase());
}
