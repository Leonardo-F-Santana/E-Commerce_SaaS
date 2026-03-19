import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/UserAuth.module.css';

export default function UserAuth() {
  const { user, logout } = useAuth();

  // Avatar Elegante com Iniciais do Nome Dinâmico (Sintonia UI Clean)
  const placeholderAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'A')}&backgroundColor=0ea5e9&textColor=ffffff`;

  // Redirecionamento Dinâmico RBAC da Arquitetura Mestra
  const dashboardRoute = user?.role === 'customer' ? '/minha-conta' : '/admin/dashboard';

  // Render C-Level: ESTADO VISITANTE (SEO e Funil Frio)
  if (!user) {
    return (
      <div className={styles.authContainer}>
        <Link href="/login" className={styles.loginLink}>
          <span className={styles.userIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <div className={styles.loginTextWrap}>
            <span className={styles.loginTextPrimary}>Entrar</span>
            <span className={styles.loginTextSecondary}>ou Cadastrar-se</span>
          </div>
        </Link>
      </div>
    );
  }

  const firstName = user.name.split(' ')[0];

  // Render C-Level: ESTADO LOGADO E RECONHECIDO COM HOVER DROPDOWN
  return (
    <div className={styles.authContainer}>
      <div className={styles.userProfile}>
        <img src={placeholderAvatar} alt="Avatar do Usuário" className={styles.avatar} />
        
        <div className={styles.greetingWrap}>
          <span className={styles.greetingText}>Olá,</span>
          <span className={styles.greetingName}>{firstName}</span>
        </div>

        {/* Dropdown Menu Flutuante - Sincronizado pelas regras de Hover do CSS */}
        <div className={styles.dropdownMenu}>
          <Link href={dashboardRoute} className={styles.dropItem}>
            <span className={styles.dropIcon}>⚙️</span> Minha Conta
          </Link>
          <Link href="/meus-pedidos" className={styles.dropItem}>
            <span className={styles.dropIcon}>📦</span> Meus Pedidos
          </Link>
          <Link href="/favoritos" className={styles.dropItem}>
            <span className={styles.dropIcon}>❤️</span> Favoritos
          </Link>
          
          <div className={styles.dropDivider}></div>
          
          <button onClick={logout} className={`${styles.dropItem} ${styles.logoutItem}`}>
            <span className={styles.dropIcon}>🚪</span> Sair
          </button>
        </div>
      </div>
    </div>
  );
}
