import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
// import '../styles/globals.css'; (Removido pois não criei o globals fisicamente nesta run, mas é padrão)

export default function MyApp({ Component, pageProps }) {
  // A Árvore Central (Root) recebe os ContextProviders
  // AuthProvider por fora pois é hierarquicamente "maior" que o carrinho.
  return (
    <AuthProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}


