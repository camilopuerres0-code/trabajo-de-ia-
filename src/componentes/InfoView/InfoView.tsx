// src/componentes/InfoView/InfoView.tsx
import { useState } from 'react';
import { FICHAS, HERRAMIENTAS, PELIGROS } from '../../data/contenido';
import styles from './InfoView.module.css';

type Tab = 'herbicidas' | 'peligros' | 'herramientas';
const TABS: { id: Tab; label: string }[] = [
  { id: 'herbicidas', label: 'Herbicidas' },
  { id: 'peligros', label: 'Peligros' },
  { id: 'herramientas', label: 'Herramientas' },
];

export const InfoView = () => {
  const [tab, setTab] = useState<Tab>('herbicidas');
  return (
    <section>
      <h1 className={styles.title}>Información</h1>
      <p className={styles.subtitle}>Conozca los productos, sus peligros y cómo protegerse.</p>
      <div className={styles.chips}>
        {TABS.map((t) => (
          <button key={t.id} type="button" className={`${styles.chip} ${tab === t.id ? styles.activo : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className={styles.lista}>
        {tab === 'herbicidas' && FICHAS.map((f) => (
          <article key={f.nombre} className={styles.card}>
            <h3>{f.nombre} <span className={styles.tag}>{f.tipo}</span></h3>
            <p><b>Uso:</b> {f.uso}</p>
            <p className={styles.peligro}>⚠ {f.peligro}</p>
            <p><b>Precaución:</b> {f.precaucion}</p>
          </article>
        ))}
        {tab === 'peligros' && PELIGROS.map((p) => (
          <article key={p.titulo} className={styles.card}>
            <h3>{p.icono} {p.titulo}</h3>
            <p>{p.texto}</p>
          </article>
        ))}
        {tab === 'herramientas' && HERRAMIENTAS.map((h) => (
          <article key={h.titulo} className={styles.card}>
            <h3>{h.icono} {h.titulo} <span className={styles.tag}>{h.grupo}</span></h3>
            <p>{h.texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
