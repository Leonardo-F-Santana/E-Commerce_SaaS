import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Se o loading terminou e o cara NÃO está logado, expulsa sumariamente para a tela de Login
    if (!loading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, router]);

  // Tela de WaitState (Evita "Piscadas" assíncronas do React enquanto confere o token local)
  if (loading) {
    return (
      <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', color: '#666'}}>
        Carregando o painel de administração...
      </div>
    );
  }

  // Intercepta a montagem se o cara é intruso
  if (!isAuthenticated) return null;

  // Se tem token e acesso de Lojista aprovado, permite renderizar!
  return children;
}
