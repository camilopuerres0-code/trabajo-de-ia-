// src/hooks/useRegistros.ts
import { useEffect, useState } from 'react';
import type { RegistroRiesgo } from '../types/index';

const STORAGE_KEY = 'terrasur_registros';

function leerRegistrosGuardados(): RegistroRiesgo[] {
  try {
    const datos = localStorage.getItem(STORAGE_KEY);
    return datos ? (JSON.parse(datos) as RegistroRiesgo[]) : [];
  } catch {
    return [];
  }
}

export function useRegistros() {
  const [registros, setRegistros] = useState<RegistroRiesgo[]>(leerRegistrosGuardados);

  // Cada vez que cambian los registros, se sincronizan con localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros.slice(0, 50))); //aqui se guardan los registros 
  }, [registros]);

  function agregarRegistro(datos: Omit<RegistroRiesgo, 'id' | 'fecha'>) {
    const nuevoRegistro: RegistroRiesgo = {
      ...datos,
      id: Date.now(),
      fecha: new Date().toISOString(),
    };
    setRegistros((prev) => [nuevoRegistro, ...prev]);
  }

  function limpiarRegistros() {
    setRegistros([]);
  }

  return { registros, agregarRegistro, limpiarRegistros };
}
