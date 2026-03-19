import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Escudo Ouro 1: Deslogado
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    
    // [RBAC] Escudo Ouro 2: Se tentar acessar a rota sendo mero Consumidor da Loja
    if (!loading && isAuthenticated && user) {
      if (user.role !== 'vendor' && user.role !== 'superadmin') {
        // Redireciona customer invasor devolta 
        router.push('/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#666'}}>
        Analisando Criptografia de Cargos (RBAC)...
      </div>
    );
  }

  // Interceptação Nativa ReAtiva para Blindagem 100% de Client-Side Render
  if (!isAuthenticated) return null;
  if (user && user.role === 'customer') return null;

  return children;
}
