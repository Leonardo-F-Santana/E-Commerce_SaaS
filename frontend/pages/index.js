import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import BannerCarousel from '../components/BannerCarousel';
import PromoCards from '../components/PromoCards';
import ProductCard from '../components/ProductCard';

// Em um ambiente de produção Fast-API isso derivaria de uma busca no banco (getStaticProps para SSG super veloz)
const MOCK_CATALOG = [
  {
    id: 1,
    slug: 'camisa-real-madrid-home-23-24',
    name: 'Camisa Real Madrid Home 24/25',
    category: 'Clubes',
    price: 299.90,
    oldPrice: 349.90,
    tenant_id: 'loja_1',
    images: ["https://images.unsplash.com/photo-1596516641571-70bfca19fb36?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: 2,
    slug: 'camisa-brasil-away-2024',
    name: 'Camisa Seleção Brasileira 2024',
    category: 'Seleções',
    price: 349.90,
    oldPrice: null,
    tenant_id: 'loja_1',
    images: ["https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: 3,
    slug: 'camisa-vasco-oficial',
    name: 'Camisa Vasco Oficial 24/25',
    category: 'Clubes',
    price: 279.90,
    oldPrice: 299.90,
    tenant_id: 'loja_1',
    images: ["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1518605368461-1ee0618eb7dc?auto=format&fit=crop&w=600&q=80"]
  },
  {
    id: 4,
    slug: 'camisa-flamengo-home-24',
    name: 'Camisa Flamengo Home 24/25',
    category: 'Clubes',
    price: 329.00,
    oldPrice: 399.00,
    tenant_id: 'loja_1',
    images: ["https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=600&q=80", "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=600&q=80"]
  }
];

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Vitals do Next.JS e Motores de Busca (SEO do Google não sofre bloqueios) */}
      <Head>
        <title>SaaS Shop | Camisas de Futebol & Mantos de Clássicos</title>
        <meta name="description" content="Compre na melhor Vitrine esportiva." />
      </Head>

      <Navbar />

      {/* Zonas de Alta Conversão B2C (Dobra Superior / Above the fold) */}
      <BannerCarousel />
      <PromoCards />

      {/* Grid Intacta Abaixo (Diretriz de Segurança) */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Grandes Lançamentos 23/24</h1>
        <p className={styles.heroSubtitle}>Adquira novos mantos em até 10x s/juros. Exclusivos da Loja.</p>
      </section>

      <main className={styles.main}>
        <div className={styles.grid}>
          {MOCK_CATALOG.map(product => (
            <ProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
