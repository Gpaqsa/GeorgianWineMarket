import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // კალათაში დამატება
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => item.id === product.id);
      if (exist) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // რაოდენობის შეცვლა (+ ან -)
  const updateQuantity = (id, amount) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + amount;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean), // შლის `null` ელემენტებს, თუ რაოდენობა 0 გახდა
    );
  };

  // პროდუქტის სრულიად წაშლა
  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // კალათის სრულად გასუფთავება (ყიდვისას)
  const clearCart = () => setCartItems([]);

  // სრული ფასი
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // ნივთების ჯამური რაოდენობა ნავბარისთვის
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
