import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/AdminLogin.module.css';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMSG, setErrorMSG] = useState('');
  const { login } = useAuth(); // Hook Customizado que fizemos para chamar as APIs

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMSG('');
    
    // Tenta Logar
    const success = await login(email, password);
    if (!success) {
      setErrorMSG('Credenciais incorretas. (Dica: admin@loja.com / 123456)');
    }
  };

  return (
    <>
      <Head>
        <title>SaaS Login | Área Restrita do Lojista</title>
      </Head>
      
      {/* Container Pai estilizado puramente pelo module.css */}
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <h1 className={styles.title}>Painel do Lojista</h1>
          <p className={styles.subtitle}>Gerencie suas camisas e vendas em segurança</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>E-mail SaaS</label>
              <input 
                type="email" 
                className={styles.input} 
                placeholder="admin@loja.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Senha de Administrador</label>
              <input 
                type="password" 
                className={styles.input} 
                placeholder="••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className={styles.button}>
              Acessar Módulo Confidencial
            </button>
            
            {/* Tratamento de Erros Client-side */}
            {errorMSG && <span className={styles.error}>{errorMSG}</span>}
          </form>
        </div>
      </div>
    </>
  );
}
