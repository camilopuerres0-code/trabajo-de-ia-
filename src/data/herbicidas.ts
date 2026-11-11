// src/data/herbicidas.ts
import type { HerbicidaKey, HerbicidaInfo } from '../types/index';

// Registro de herbicidas tipado con Record<Clave, Info>: TypeScript obliga
// a que cada clave declarada en HerbicidaKey exista aquí con su información.
export const HERBICIDAS: Record<HerbicidaKey, HerbicidaInfo> = {
  glifosato: {
    nombre: 'Glifosato',
    descripcion: 'Herbicida sistémico ampliamente usado',
    factorToxicidad: 1.0,
    umbralSeguro: 50,
  },
  '24d': {
    nombre: '2,4-D',
    descripcion: 'Herbicida hormonal selectivo para dicotiledóneas',
    factorToxicidad: 1.4,
    umbralSeguro: 35,
  },
  atrazina: {
    nombre: 'Atrazina',
    descripcion: 'Herbicida triazínico de amplio espectro',
    factorToxicidad: 1.8,
    umbralSeguro: 25,
  },
  paraquat: {
    nombre: 'Paraquat',
    descripcion: 'Herbicida de contacto de alta toxicidad',
    factorToxicidad: 2.5,
    umbralSeguro: 15,
  },
  diuron: {
    nombre: 'Diurón',
    descripcion: 'Herbicida uréico de acción residual',
    factorToxicidad: 1.6,
    umbralSeguro: 30,
  },
};
