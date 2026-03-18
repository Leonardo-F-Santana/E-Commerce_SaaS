import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Executado apenas no client-side após a renderização inicial
  useEffect(() => {
    const token = localStorage.getItem('@ecomm:token');
    const savedUser = localStorage.getItem('@ecomm:user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // MOCK LOGIN - Simula a chamada da API FastAPI (Token JWT + Informação do Tenant_ID)
    if (email === 'admin@loja.com' && password === '123456') {
      const mockUser = { id: 1, email, name: 'João (Lojista)', role: 'TENANT_ADMIN' };
      const mockToken = 'abc123_jwt_token_verificado';

      localStorage.setItem('@ecomm:token', mockToken);
      localStorage.setItem('@ecomm:user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      router.push('/admin/dashboard');
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('@ecomm:token');
    localStorage.removeItem('@ecomm:user');
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
