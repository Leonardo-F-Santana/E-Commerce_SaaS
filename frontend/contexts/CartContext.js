import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // HYDRATION SEGURA (Client-side Rendering vs Server-side Rendering)
  // Carregamos do localStorage apenas quando o componente montar no cliente
  useEffect(() => {
    const savedCart = localStorage.getItem('@ecomm:cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Erro ao carregar o estado do carrinho", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Persiste no localStorage sempre que o carrinho modificar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('@ecomm:cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (product, size) => {
    setCart((prev) => {
      // Verifica se a exata variação já existe no carrinho
      const existing = prev.find(item => item.id === product.id && item.size === size);
      
      if (existing) {
        // Incrementa quantidade
        return prev.map(item => 
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      // Adiciona novo item do zero
      return [...prev, { ...product, size, quantity: 1 }];
    });
  };

  const removeFromCart = (productId, size) => {
    setCart((prev) => prev.filter(item => !(item.id === productId && item.size === size)));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      getCartTotal, 
      getCartCount, 
      isLoaded 
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook Customizado Injetável
export function useCart() {
  return useContext(CartContext);
}
