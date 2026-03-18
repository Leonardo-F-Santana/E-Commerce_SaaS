import Head from 'next/head';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/Cart.module.css';
import Navbar from '../components/Navbar';

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal, isLoaded } = useCart();

  // Esperamos a Hydratation terminar no Client-side. Impede o React de renderizar 2 layouts diferentes e crashar
  if (!isLoaded) return <div className={styles.container} style={{backgroundColor: '#f8fafc', height: '100vh'}}></div>;

  const total = getCartTotal();

  return (
    <div className={styles.container}>
      <Head>
        <title>Seu Carrinho | SaaS Shop</title>
      </Head>

      <Navbar />

      <main className={styles.main}>
        {/* LISTA DE COMPRAS (Distorcida do localStorage pelo CartContext.js) */}
        <div className={styles.cartList}>
          <h1 className={styles.title}>Carrinho de Compras</h1>
          
          {cart.length === 0 ? (
            <div className={styles.emptyText}>
              <p>Seu carrinho está limpo nesse momento.</p>
              <Link href="/" className={styles.emptyBtn}>Carregar meu carrrinho de Camisas</Link>
            </div>
          ) : (
            cart.map((item, idx) => (
              <article key={`${item.id}-${item.size}-${idx}`} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} loading="lazy" />
                <div className={styles.itemInfo}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <span className={styles.itemDetails}>Tamanho Oficial: {item.size} | Qtd Selecionada: {item.quantity}</span>
                  
                  <div className={styles.itemMeta}>
                    <span className={styles.itemPrice}>
                      {/* O subtotal é dinâmico (quantidade * preço da un.) */}
                      R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      X Remover Item
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* CÁLCULO FINANCEIRO */}
        <aside className={styles.summaryBox}>
          <h2 className={styles.summaryTitle}>Resumo Financeiro</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal Bruto</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className={styles.summaryRow}>
            <span>Cálculo de Despacho (Frete)</span>
            <span style={{color: '#0ea5e9', fontWeight: 600}}>Calculado no Fechamento</span>
          </div>
          
          <div className={styles.summaryTotalRow}>
            <span>Total da Sua Compra</span>
            <span style={{color: '#00a650'}}>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>

          {/* O link aponta para o checkout seguro. */}
          <Link 
            href={cart.length > 0 ? "/checkout" : "#"} 
            className={styles.checkoutBtn}
            style={{ 
              opacity: cart.length > 0 ? 1 : 0.5, 
              pointerEvents: cart.length > 0 ? 'auto' : 'none' 
            }}
          >
            Avançar para Checkout Blindado
          </Link>
        </aside>
      </main>
    </div>
  );
}
