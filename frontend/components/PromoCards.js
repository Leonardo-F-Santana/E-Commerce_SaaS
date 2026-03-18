import Link from 'next/link';
import styles from '../styles/PromoCards.module.css';

export default function PromoCards() {
  return (
    <section className={styles.container} aria-label="Zonas Profundas de Ofertas">
      <div className={styles.grid}>
        
        {/* CARD 1: Combo Maker (Target: High Ticket) */}
        <Link href="/ofertas/combo" className={`${styles.card} ${styles.comboCard}`}>
          <h3 className={styles.title}>2 Camisas<br/>por R$ 150</h3>
          <p className={styles.subtitle}>Monte seu kit oficial & economize</p>
          <span className={styles.icon}>🛍️</span>
        </Link>
        
        {/* CARD 2: Oferta Rápida (Target: Daily Volume) */}
        <Link href="/ofertas/ate-99" className={`${styles.card} ${styles.discountCard}`}>
          <h3 className={styles.title}>Produtos<br/>até R$ 99</h3>
          <p className={styles.subtitle}>Treino e Dia a dia com Desconto</p>
          <span className={styles.icon}>⚡</span>
        </Link>

        {/* CARD 3: Urgência Clearance (Target: Queima de Estoque) */}
        <Link href="/ofertas/saldao" className={`${styles.card} ${styles.clearanceCard}`}>
          <h3 className={styles.title}>Saldão<br/>Limpa Estoque</h3>
          <p className={styles.subtitle}>Últimas peças com incríveis 50% OFF</p>
          <span className={styles.icon}>🔥</span>
        </Link>

      </div>
    </section>
  );
}
