import { useState, useEffect } from 'react';
import styles from '../styles/BannerCarousel.module.css';

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1920&q=80',
    title: 'Nova Coleção Real Madrid 24/25',
    subtitle: 'A grandiosidade merengue em cada fio. Garanta a camisa oficial de jogo com 10% OFF pagando via PIX.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1518605368461-1ee0618eb7dc?auto=format&fit=crop&w=1920&q=80',
    title: 'Manto do Mengão - Edição Retrô',
    subtitle: 'A história rubro-negra revivida nos estádios. Edições de colecionador estritamente limitadas.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1920&q=80',
    title: 'Seleções Nacionais 2024',
    subtitle: 'Sua seleção favorita já entrou em campo para os amistosos da temporada. Confira o manto pesado e vá torcer com estilo.',
  }
];

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Engine leve em Hook de Autoplay (Roda infinito a cada 6 segundos)
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 6000);
    
    // Clear ao desmontar salvando consumo de RAM do Client
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carouselContainer} aria-label="Galeria Promocional de Lançamentos">
      {SLIDES.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`${styles.slide} ${index === current ? styles.active : ''}`}
        >
          <img src={slide.image} alt="Modelo de Camisa" className={styles.image} />
          
          {/* Overlay Escuro Responsável por Dar Leitura ao Texto */}
          <div className={styles.overlay}>
            <h2 className={styles.title}>{slide.title}</h2>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <button className={styles.ctaBtn}>Acessar Vitrine</button>
          </div>
        </div>
      ))}

      {/* Controller de Pontinhos Tátil */}
      <div className={styles.indicators}>
        {SLIDES.map((_, index) => (
          <button 
            key={index} 
            className={`${styles.dot} ${index === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(index)}
            aria-label={`Ir para o slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
