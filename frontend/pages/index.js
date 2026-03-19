import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Navbar from '../components/Navbar';
import BannerCarousel from '../components/BannerCarousel';
import PromoCards from '../components/PromoCards';
import ProductCard from '../components/ProductCard';

export default function Home() {
  // [DIRETRIZ DE C-LEVEL FETCHING] - Substituindo os Mocks pela Rota Viva Python!
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Efeito Re-ativo do React. O 'cache: no-store' faria o Edge Next.JS atirar fora lixos de revalidação antigos.
    const fetchCatalog = async () => {
      try {
        // [DIRETRIZ DE REVALIDAÇÃO] 'no-store' inibe L3 Cache (Obrigando o NextJS a ir buscar a última camisa cadastrada)
        const res = await fetch("http://localhost:8000/products/", { cache: 'no-store' });
        if (!res.ok) throw new Error("Erro L3 Fetch Database");
        
        const data = await res.json();
        // Fallback robusto pra vitrine nunca quebrar caso array venha mal formatado
        const safeData = data.map(p => ({
            ...p,
            images: p.images && p.images.length > 0 ? p.images : ["https://images.unsplash.com/photo-1596516641571-70bfca19fb36?auto=format&fit=crop&w=600&q=80"]
        }));
        
        setProducts(safeData);
        setIsLoading(false);
      } catch (err) {
        console.error("[Vitrine Fallback]", err);
        setIsLoading(false);
      }
    };
    fetchCatalog();
  }, []);

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
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', width: '100%', gridColumn: '1 / -1' }}>
            {/* SPINNER ANIMADO W3C PURO */}
            <div className={styles.spinner} style={{ border: '4px solid rgba(0,0,0,0.05)', width: '45px', height: '45px', borderRadius: '50%', borderLeftColor: '#0ea5e9', borderRightColor: '#ea580c', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
            <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            <h2 style={{ color: '#475569', fontSize: '1.3rem', fontWeight: '800' }}>Invocando Carga do Banco de Dados...</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>Autenticando Arquivos de Midia via Fast API.</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', width: '100%', gridColumn: '1 / -1' }}>
            <h2 style={{ color: '#cbd5e1' }}>❌ O Lojista limpou o Estoque. Nenhuma Manto foi encontrado!</h2>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id || product.slug} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
