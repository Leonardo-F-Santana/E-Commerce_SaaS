import { useState } from 'react';
import Head from 'next/head';
// Opcional, o Image do next.js deve ser importado se for domínios configurados
// import Image from 'next/image'; 
import { useCart } from '../../contexts/CartContext';
import styles from '../../styles/Product.module.css';
import Navbar from '../../components/Navbar';

// Mock gerado para servir de base no SSR (getStaticProps ou getServerSideProps na vida real)
const MOCK_PRODUCT = {
  id: 'camisa-real-madrid-home-23-24',
  name: 'Camisa Real Madrid Home 23/24 Torcedor Masculina',
  brand: 'Adidas',
  price: 299.99,
  oldPrice: 349.99,
  description: 'A nova camisa titular do Real Madrid combina tradição e inovação. Com tecido respirável Aeroready, ela mantém o corpo seco durante os jogos ou no dia a dia. Garanta a sua e mostre sua paixão pelo maior clube do mundo!',
  images: [
    'https://via.placeholder.com/800x800/f8f9fa/333333.png?text=Camisa+Real+Madrid+23-24'
  ],
  sizes: ['P', 'M', 'G', 'GG', 'XG'],
};

export default function ProductPage({ product = MOCK_PRODUCT }) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(null);

  const handleBuy = () => {
    if (!selectedSize) {
      alert('⚠️ Por favor, selecione um tamanho antes de prosseguir.');
      return;
    }
    
    // Dispara Context API do carrinho
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, selectedSize);
    
    // Na vida real, redirecionamos (fast-checkout) com router.push('/cart')
    // ou abrimos o Drawer do carrinho pela ContextAPI
    alert('✅ Produto adicionado ao carrinho! Indo para o checkout...');
  };

  return (
    <>
      <Head>
        {/* SEO Dinâmico Essencial */}
        <title>{product.name} | Seu E-Commerce SaaS</title>
        <meta name="description" content={product.description.substring(0, 150)} />
      </Head>
      
      <Navbar />

      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <a href="/">Início</a> &gt; <a href="/times/real-madrid">Real Madrid</a> &gt; Camisas
        </nav>

        <main className={styles.productWrapper}>
          {/* FOTO DO PRODUTO */}
          <section className={styles.imageContainer}>
            {/* O Next/Image seria ideal aqui -> <Image src={product.images[0]} layout="fill" ... /> */}
            <img 
              src={product.images[0]} 
              alt={`Foto da ${product.name}`} 
              className={styles.image}
              loading="lazy"
            />
          </section>

          {/* ÁREA DE COMPRA DO PRODUTO */}
          <section className={styles.infoContainer}>
            <h1 className={styles.title}>{product.name}</h1>
            
            <div className={styles.priceWrapper}>
              {product.oldPrice && <span className={styles.oldPrice}>R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>}
              <span className={styles.currentPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</span>
              <span className={styles.installments}>ou 10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')} sem juros</span>
            </div>

            <div className={styles.sizeSection}>
              <h3 className={styles.sizeTitle}>Tamanho</h3>
              <div className={styles.sizeGrid}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    className={`${styles.sizeButton} ${selectedSize === size ? styles.sizeButtonActive : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button className={styles.buyButton} onClick={handleBuy}>
              Comprar
            </button>

            <div className={styles.descriptionSection}>
              <h3 className={styles.descriptionTitle}>Descrição do Produto</h3>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

// Em uma implementação full-stack Next.js:
// export async function getStaticPaths() {}
// export async function getStaticProps({ params }) {}
