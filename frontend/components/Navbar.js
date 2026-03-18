import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Segurança Acatada: Hooks intactos mantendo variáveis exatas de Context da fase de Criação
  const { getCartCount, isLoaded } = useCart();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={styles.navbar}>
      {/* SECTION 1: Barra Dark Executiva B2C */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button className={styles.hamburgerBtn} onClick={toggleMenu} aria-label="Menu Mobile">
            ☰
          </button>
          <Link href="/" className={styles.logo}>
            SAAS_SPORTS
          </Link>
        </div>

        {/* Carrinho flutuante (Sem hydration mismatch graças ao isLoaded) */}
        <Link href="/cart" className={styles.cartButton}>
          🛒 Carrinho
          {isLoaded && getCartCount() > 0 && (
            <span className={styles.cartBadge}>{getCartCount()}</span>
          )}
        </Link>
      </div>

      {/* SECTION 2: Barra Light Links Clean */}
      <div className={styles.bottomBar}>
        <ul className={`${styles.categoryList} ${isOpen ? styles.categoryListOpen : ''}`}>
          <li className={styles.categoryItem}>
            <Link href="/categoria/infantil" className={styles.categoryLink}>Infantil</Link>
          </li>
          <li className={styles.categoryItem}>
            <Link href="/categoria/feminino" className={styles.categoryLink}>Feminino</Link>
          </li>
          <li className={styles.categoryItem}>
            <Link href="/categoria/masculino" className={styles.categoryLink}>Masculino</Link>
          </li>
          <li className={styles.categoryItem}>
            <Link href="/categoria/basquete" className={styles.categoryLink}>Basquete</Link>
          </li>
          <li className={styles.categoryItem}>
            <Link href="/categoria/futebol" className={styles.categoryLink}>Futebol</Link>
          </li>
          <li className={styles.categoryItem}>
            <Link href="/ofertas" className={`${styles.categoryLink} ${styles.ofertas}`}>Ofertas</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
