// src/services/climaApi.ts
// Segunda API externa (Tema 4), consumida con Axios en lugar de fetch.
// Open-Meteo es pública y no requiere API key. El viento y la temperatura
// influyen en la deriva de herbicidas, por eso es útil para el proyecto.
import axios from 'axios';
import type { ClimaCiudad } from '../types/index';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const CIUDADES = [
  { nombre: 'Pasto', lat: 1.21, lon: -77.28 },
  { nombre: 'Popayán', lat: 2.44, lon: -76.61 },
  { nombre: 'Cali', lat: 3.45, lon: -76.53 },
];

interface OpenMeteoRespuesta {
  current: {
    temperature_2m: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
}

async function consultarCiudad(c: (typeof CIUDADES)[number]): Promise<ClimaCiudad> {
  const { data } = await axios.get<OpenMeteoRespuesta>(BASE_URL, {
    params: {
      latitude: c.lat,
      longitude: c.lon,
      current: 'temperature_2m,wind_speed_10m,relative_humidity_2m',
    },
    timeout: 8000,
  });
  return {
    ciudad: c.nombre,
    temperatura: data.current.temperature_2m,
    viento: data.current.wind_speed_10m,
    humedad: data.current.relative_humidity_2m,
  };
}

// Múltiples llamadas en paralelo con Promise.all
export function consultarClimaCiudades(): Promise<ClimaCiudad[]> {
  return Promise.all(CIUDADES.map(consultarCiudad));
}
