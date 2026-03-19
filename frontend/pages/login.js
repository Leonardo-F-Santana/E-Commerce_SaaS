import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/Auth.module.css';
import Link from 'next/link';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  // Estados dos Inputs de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados dos Inputs de Cadastro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      // O Provider do AuthContext encarrega de redirecionar para '/' ou '/admin/dashboard' via RBAC
      if (!response.success) {
        setError(response.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Problema de Rede: API FastAPI Oflfine ou CORS Block.');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirm) {
      return setError('As senhas digitadas não coincidem.');
    }

    setLoading(true);
    try {
      // Integração HTTP com a Real API Register
      const res = await register(regName, regEmail, regPassword);
      if (!res.success) {
        setError(res.error);
        setLoading(false);
        return;
      }
      
      // Se o POST 201 Created der certo: Auto-Login Transparente UI!
      const loginRes = await login(regEmail, regPassword);
      if (!loginRes.success) {
        setError(loginRes.error);
        setLoading(false);
      }
      
    } catch (err) {
      setError('Falha Crítica ao contatar Base de Dados C-Level.');
      setLoading(false);
    } 
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Autenticação | SAAS SPORTS</title>
      </Head>

      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div className={styles.logoArea}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className={styles.logoText}>SAAS_SPORTS</span>
          </Link>
        </div>

        <div className={styles.authCard}>
          {/* O Toggle Header Responsável pela Alternância de Componentes SEM Reload VDOM */}
          <div className={styles.toggleHeader}>
            <button 
              className={`${styles.toggleBtn} ${activeTab === 'login' ? styles.activeToggle : ''}`}
              onClick={() => { setActiveTab('login'); setError(''); }}
            >
              ENTRAR
            </button>
            <button 
              className={`${styles.toggleBtn} ${activeTab === 'register' ? styles.activeToggle : ''}`}
              onClick={() => { setActiveTab('register'); setError(''); }}
            >
              CADASTRAR-SE
            </button>
          </div>

          <div className={styles.formBody}>
            {error && <div className={styles.errorMsg}>{error}</div>}

            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <h2 className={styles.title}>Acesse sua Conta</h2>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail de acesso</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={email} onChange={e => setEmail(e.target.value)}
                    required placeholder="Endereço de e-mail"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Senha secreta</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={password} onChange={e => setPassword(e.target.value)}
                    required placeholder="••••••••"
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Autenticando Criptografia...' : 'Acessar Plataforma'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <h2 className={styles.title}>Crie sua Conta Grátis</h2>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome Completo</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={regName} onChange={e => setRegName(e.target.value)}
                    required placeholder="Ex: Leonardo Santana"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>E-mail Permanente</label>
                  <input 
                    type="email" 
                    className={styles.input} 
                    value={regEmail} onChange={e => setRegEmail(e.target.value)}
                    required placeholder="exemplo@gmail.com"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Crie uma Senha</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={regPassword} onChange={e => setRegPassword(e.target.value)}
                    required placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Confirme sua Senha</label>
                  <input 
                    type="password" 
                    className={styles.input} 
                    value={regConfirm} onChange={e => setRegConfirm(e.target.value)}
                    required placeholder="Repita exatamente"
                  />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={loading} style={{ backgroundColor: '#10b981' }}>
                  {loading ? 'Sincronizando Banco de Dados...' : 'Criar Conta de Comprador'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
