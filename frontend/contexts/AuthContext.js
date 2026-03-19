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

  const register = async (name, email, password) => {
    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: 'customer' })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Erro na base Python API");
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      if (!response.ok) {
         const errData = await response.json();
         throw new Error(errData.detail || "Credenciais Incorretas.");
      }

      const data = await response.json();
      // Emula o nome a partir do email (em prod veriamos FullName extraído da API)
      const loadedRole = data.role ? data.role.toLowerCase() : 'customer';
      const loadedUser = { id: data.sub, email, name: email.split('@')[0], role: loadedRole, tenant_id: data.tenant_id };
      
      localStorage.setItem('@ecomm:token', data.access_token);
      localStorage.setItem('@ecomm:user', JSON.stringify(loadedUser));
      setUser(loadedUser);
      
      if (loadedUser.role === 'customer') {
         router.push('/');
      } else {
         router.push('/admin/dashboard');
      }
      return { success: true };
    } catch (error) {
      console.error(`[AuthContext] Falha Crítica ao tentar realizar POST na URL: ${url}`, error);
      return { success: false, error: `${error.message} - Verifique se a URL ${url} está acessível.` };
    }
  };

  const logout = () => {
    localStorage.removeItem('@ecomm:token');
    localStorage.removeItem('@ecomm:user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
