"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  variantId: string;
  title: string;
  variantName: string;
  qty: number;
  price: number;
};

const CartContext = createContext<{
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string, variantId: string) => void;
  updateQty: (productId: string, variantId: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
}>({
  items: [],
  add: () => {},
  remove: () => {},
  updateQty: () => {},
  clear: () => {},
  subtotal: 0,
});

function useCartProvider() {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const found = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (found) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  };

  const remove = (productId: string, variantId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  };

  const updateQty = (productId: string, variantId: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId && i.variantId === variantId ? { ...i, qty } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );

  return { items, add, remove, updateQty, clear, subtotal };
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cart = useCartProvider();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
