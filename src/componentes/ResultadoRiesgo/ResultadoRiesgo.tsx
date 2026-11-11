// src/componentes/ResultadoRiesgo/ResultadoRiesgo.tsx
import { useEffect, useState } from 'react';
import type { ResultadoRiesgo as ResultadoRiesgoType } from '../../types/index';
import { formatearNumero } from '../../utils/calculoRiesgo';
import { ICONO_NIVEL } from '../../data/contenido';
import styles from './ResultadoRiesgo.module.css';

interface ResultadoRiesgoProps {
  resultado: ResultadoRiesgoType | null;
  onVerHerbicida: () => void;
}

// Ángulo de la aguja según el nivel (-90° = extremo izquierdo, 90° = derecho)
const ANGULO: Record<string, number> = { Bajo: -67.5, Medio: -22.5, Alto: 22.5, Crítico: 67.5 };

const Medidor = ({ nivel }: { nivel?: string }) => {
  // La aguja parte en reposo y se mueve al valor: así la transición CSS se ve
  const [angulo, setAngulo] = useState(-90);
  useEffect(() => {
    const t = setTimeout(() => setAngulo(nivel ? ANGULO[nivel] : -90), 60);
    return () => clearTimeout(t);
  }, [nivel]);

  return (
    <div className={styles.medidor} aria-hidden="true">
      <svg viewBox="0 0 300 185">
        <path className={`${styles.tramo} ${styles.tBajo}`} d="M40 150 A110 110 0 0 1 72.22 72.22" />
        <path className={`${styles.tramo} ${styles.tMedio}`} d="M72.22 72.22 A110 110 0 0 1 150 40" />
        <path className={`${styles.tramo} ${styles.tAlto}`} d="M150 40 A110 110 0 0 1 227.78 72.22" />
        <path className={`${styles.tramo} ${styles.tCritico}`} d="M227.78 72.22 A110 110 0 0 1 260 150" />
        <g className={styles.aguja} style={{ transform: `rotate(${angulo}deg)` }}>
          <path d="M144 150 L150 46 L156 150 Z" fill="#17261e" />
        </g>
        <circle cx="150" cy="150" r="13" fill="#17261e" />
        <circle cx="150" cy="150" r="5" fill="#ffc531" />
        <text className={styles.etiquetaMedidor} x="40" y="178" textAnchor="middle">Bajo</text>
        <text className={styles.etiquetaMedidor} x="260" y="178" textAnchor="middle">Crítico</text>
      </svg>
    </div>
  );
};

export const ResultadoRiesgo = ({ resultado, onVerHerbicida }: ResultadoRiesgoProps) => {
  // Renderizado condicional: sin resultado se invita a calcular
  if (!resultado) {
    return (
      <div className={`${styles.resultado} ${styles.vacio}`}>
        <Medidor />
        <p>Complete los datos y presione «Calcular riesgo» para ver el resultado aquí.</p>
      </div>
    );
  }

  return (
    <div className={styles.resultado} role="alert">
      <Medidor nivel={resultado.nivel} />
      <div className={styles.resultadoHeader}>
        <span className={styles.resultadoLabel}>Nivel de riesgo</span>
        <span className={`${styles.nivelBadge} ${styles[toCamel(resultado.clase)]}`}>
          {ICONO_NIVEL[resultado.nivel]} {resultado.nivel.toUpperCase()}
        </span>
      </div>

      <p className={styles.resultadoTexto}>{resultado.mensaje}</p>

      <div className={styles.resultadoDetalles}>
        <div className={styles.detalle}>
          <span className={styles.detalleLabel}>Índice de exposición</span>
          <span className={styles.detalleValor}>{formatearNumero(resultado.indiceExposicion)}</span>
        </div>
        <div className={styles.detalle}>
          <span className={styles.detalleLabel}>Dosis total estimada</span>
          <span className={styles.detalleValor}>{formatearNumero(resultado.dosisTotal, 0)} mg</span>
        </div>
      </div>

      <p className={styles.porque}>¿Por qué este nivel? Se multiplica la concentración, el área y la toxicidad del producto, y se compara con el límite seguro de ese herbicida.</p>

      <button type="button" className={styles.btnHerbicida} onClick={onVerHerbicida}>
        Ver imágenes de este herbicida
      </button>
    </div>
  );
};

// Convierte 'nivel-critico' -> 'nivelCritico' para poder usarlo
// como clave de las clases generadas por CSS Modules.
function toCamel(clase: string): string {
  return clase.replace(/-([a-z])/g, (_, letra: string) => letra.toUpperCase());
}
