import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import PrivateRoute from '../../components/PrivateRoute';
import styles from '../../styles/AdminDashboard.module.css';

// Mock DB do SaaS
const mockShirts = [
  { id: '1b4', name: 'Camisa Real Madrid Home 23/24', category: 'Clubes', price: 299.99, stock: 45 },
  { id: '9a2', name: 'Camisa Seleção do Brasil Away', category: 'Seleções', price: 349.90, stock: 12 }
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    // Componente "Segurança Máxima": Nada desce sem o JWT verificado.
    <PrivateRoute>
      <Head>
        <title>Dashboard | Painel do Lojista</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Olá, {user?.name || 'Administrador'}!</h1>
          <div>
            <Link href="/admin/products/new" className={styles.addButton}>
              + Nova Camisa
            </Link>
            <button onClick={logout} className={styles.logoutBtn}>
              Sair
            </button>
          </div>
        </header>

        <main className={styles.main}>
          <h2 style={{marginBottom: '20px', color: '#1e293b'}}>Catálogo Pessoal do SaaS</h2>
          
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Código</th>
                <th className={styles.th}>Nome da Camisa (Slug)</th>
                <th className={styles.th}>Categoria</th>
                <th className={styles.th}>Preço</th>
                <th className={styles.th}>Estoque Virtual</th>
              </tr>
            </thead>
            <tbody>
              {mockShirts.map(shirt => (
                <tr key={shirt.id}>
                  <td className={styles.td}><span className={styles.idBadge}>{shirt.id}</span></td>
                  <td className={styles.td}><strong>{shirt.name}</strong></td>
                  <td className={styles.td}>{shirt.category}</td>
                  <td className={styles.td}>R$ {shirt.price.toFixed(2).replace('.', ',')}</td>
                  <td className={styles.td}>{shirt.stock} un.</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {mockShirts.length === 0 && (
             <p style={{padding: '24px', textAlign: 'center', color: '#64748b'}}>Nenhuma camisa cadastrada do seu lojista ainda.</p>
          )}
        </main>
      </div>
    </PrivateRoute>
  );
}
