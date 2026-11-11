// src/componentes/CalculadoraForm/CalculadoraForm.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { HerbicidaKey, RegistroRiesgo } from '../../types/index';
import { HERBICIDAS } from '../../data/herbicidas';
import { calcularRiesgo } from '../../utils/calculoRiesgo';
import styles from './CalculadoraForm.module.css';

// El formulario avisa a App.tsx cada vez que se calculó un riesgo,
// enviando el registro completo ya armado (props hacia arriba vía callback).
interface CalculadoraFormProps {
  onResultado: (registro: Omit<RegistroRiesgo, 'id' | 'fecha'>) => void;
}

export const CalculadoraForm = ({ onResultado }: CalculadoraFormProps) => {
  const [herbicidaKey, setHerbicidaKey] = useState<HerbicidaKey>('glifosato');
  const [concentracion, setConcentracion] = useState('1.25');
  const [area, setArea] = useState('15');
  const [errores, setErrores] = useState<{ concentracion: boolean; area: boolean }>({
    concentracion: false,
    area: false,
  });

  const herbicidaInfo = HERBICIDAS[herbicidaKey];

  function manejarEnvio(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const concentracionNum = parseFloat(concentracion);
    const areaNum = parseFloat(area);

    const nuevosErrores = {
      concentracion: isNaN(concentracionNum) || concentracionNum <= 0,
      area: isNaN(areaNum) || areaNum <= 0,
    };
    setErrores(nuevosErrores);

    if (nuevosErrores.concentracion || nuevosErrores.area) return;

    const resultado = calcularRiesgo(concentracionNum, areaNum, herbicidaKey);

    onResultado({
      herbicida: herbicidaInfo.nombre,
      concentracion: concentracionNum,
      area: areaNum,
      ...resultado,
    });
  }

  return (
    <form className={styles.form} noValidate onSubmit={manejarEnvio}>
      <div className={styles.field}>
        <label htmlFor="herbicida">Herbicida</label>
        <select
          id="herbicida"
          value={herbicidaKey}
          onChange={(e) => setHerbicidaKey(e.target.value as HerbicidaKey)}
        >
          {Object.entries(HERBICIDAS).map(([key, info]) => (
            <option key={key} value={key}>
              {info.nombre}
            </option>
          ))}
        </select>
        <p className={styles.helper}>{herbicidaInfo.descripcion}</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="concentracion">Concentración (mg/l)</label>
        <input
          type="number"
          id="concentracion"
          value={concentracion}
          min="0.01"
          step="0.01"
          className={errores.concentracion ? styles.error : ''}
          onChange={(e) => setConcentracion(e.target.value)}
        />
        <p className={styles.helper}>Cuánto producto lleva cada litro de agua de la mezcla. Ejemplo: 1,25 mg en 1 litro.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="area">Área (hectáreas)</label>
        <input
          type="number"
          id="area"
          value={area}
          min="0.1"
          step="0.1"
          className={errores.area ? styles.error : ''}
          onChange={(e) => setArea(e.target.value)}
        />
      </div>

      <button type="submit" className={styles.btnPrimary}>
        Calcular riesgo
      </button>
    </form>
  );
};
