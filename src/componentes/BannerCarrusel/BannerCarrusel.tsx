// src/componentes/BannerCarrusel/BannerCarrusel.tsx
import { useEffect, useState } from 'react';
import { BANNERS } from '../../data/contenido';
import styles from './BannerCarrusel.module.css';

// Banner que rota solo cada 5 s; los puntos permiten elegir uno manualmente.
export const BannerCarrusel = () => {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const b = BANNERS[i];
  return (
    <div className={styles.banner} style={{ background: b.color }} key={i}>
      <span className={styles.icono}>{b.icono}</span>
      <div>
        <strong>{b.titulo}</strong>
        <p>{b.texto}</p>
      </div>
      <div className={styles.puntos}>
        {BANNERS.map((_, n) => (
          <button key={n} type="button" aria-label={`Banner ${n + 1}`} className={n === i ? styles.on : ''} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
};
