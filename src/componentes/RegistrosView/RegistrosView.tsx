// src/componentes/RegistrosView/RegistrosView.tsx
import { useState } from 'react';
import type { RegistroRiesgo } from '../../types/index';
import { RegistroItem } from '../RegistroItem/RegistroItem';
import styles from './RegistrosView.module.css';

interface RegistrosViewProps {
  registros: RegistroRiesgo[];
  onLimpiar: () => void;
}

export const RegistrosView = ({ registros, onLimpiar }: RegistrosViewProps) => {
  const [soloAlto, setSoloAlto] = useState(false);
  const visibles = soloAlto ? registros.filter((r) => r.nivel === 'Alto' || r.nivel === 'Crítico') : registros;

  function manejarLimpiar() {
    if (confirm('¿Desea eliminar todos los registros?')) onLimpiar();
  }

  return (
    <section>
      <h1 className={styles.title}>Registros</h1>
      <p className={styles.subtitle}>Historial de evaluaciones de riesgo realizadas.</p>

      {registros.length > 0 && (
        <div className={styles.filtros}>
          <button type="button" className={`${styles.chip} ${!soloAlto ? styles.activo : ''}`} onClick={() => setSoloAlto(false)}>Todos ({registros.length})</button>
          <button type="button" className={`${styles.chip} ${soloAlto ? styles.activo : ''}`} onClick={() => setSoloAlto(true)}>✖ Riesgo alto</button>
        </div>
      )}

      {visibles.length === 0 ? (
        <p className={styles.emptyState}>{registros.length === 0 ? 'No hay registros aún. Calcule un riesgo para guardarlo aquí.' : 'No hay registros de riesgo alto.'}</p>
      ) : (
        <div className={styles.registrosLista}>
          {visibles.map((registro) => (
            <RegistroItem key={registro.id} {...registro} />
          ))}
        </div>
      )}

      {registros.length > 0 && (
        <button type="button" className={styles.btnSecondary} onClick={manejarLimpiar}>Limpiar registros</button>
      )}
    </section>
  );
};
