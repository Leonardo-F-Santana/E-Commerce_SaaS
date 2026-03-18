import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/ProductCard.module.css';

// DIRETRIZ DE SEGURANÇA: Desconstruindo estritamente as propriedades nativas de Banco { product } 
export default function ProductCard({ product }) {
  const [currentImage, setCurrentImage] = useState(0);

  // Fallback seguro de String ou Array contra Erro Fatal TypeError map is not a function
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/400x400?text=SaaS+Produto+Visual'];

  // Intervalo Limpo (Cleanup nativo para evitar lentidão em Vitrines infinitas)
  useEffect(() => {
    if (images.length <= 1) return;

    // Foto da Camisa slide a cada 4000ms
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      
      {/* Container Fotográfico do Motor de Transição */}
      <div className={styles.imageContainer}>
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`${product.name} - Vestimenta de Jogo`} 
            className={`${styles.image} ${index === currentImage ? styles.imageActive : ''}`}
            loading="lazy" /* Impede download de imagens invisíveis na Grid inicial */
          />
        ))}
        
        {/* Marcadores de Galeria Ativos */}
        {images.length > 1 && (
          <div className={styles.indicators}>
            {images.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.dot} ${index === currentImage ? styles.dotActive : ''}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.cardInfo}>
        <span className={styles.productCategory}>{product.category}</span>
        <h2 className={styles.productName}>{product.name}</h2>
        <p className={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</p>
        <button className={styles.buyBtn} tabIndex="-1">Comprar Agora</button>
      </div>
    </Link>
  );
}
