import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import * as cartService from "../services/cart";

interface CartItemWithProduct {
  productId: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  count: number;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQty: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gardens_cart";

function getLocalCart(): CartItemWithProduct[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function setLocalCart(items: CartItemWithProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user) {
      cartService.getCartItems(user.id).then(dbItems => {
        const local = getLocalCart();
        const merged = [...dbItems];
        for (const li of local) {
          const existing = merged.find((m: any) => m.product_id === li.productId);
          if (existing) {
            existing.quantity += li.quantity;
          } else {
            cartService.upsertCartItem(user.id, li.productId, li.quantity);
          }
        }
        setItems(merged.map((i: any) => ({ productId: i.product_id, quantity: i.quantity })));
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
      });
    } else {
      setItems(getLocalCart());
      setLoading(false);
    }
  }, [user]);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    if (user) {
      await cartService.upsertCartItem(user.id, productId, quantity);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map((i: any) => ({ productId: i.product_id, quantity: i.quantity })));
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.productId === productId);
        if (existing) {
          const next = prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
          setLocalCart(next);
          return next;
        }
        const next = [...prev, { productId, quantity }];
        setLocalCart(next);
        return next;
      });
    }
  }, [user]);

  const removeItem = useCallback(async (productId: number) => {
    if (user) {
      await cartService.removeCartItem(user.id, productId);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map((i: any) => ({ productId: i.product_id, quantity: i.quantity })));
    } else {
      setItems(prev => {
        const next = prev.filter(i => i.productId !== productId);
        setLocalCart(next);
        return next;
      });
    }
  }, [user]);

  const updateQty = useCallback(async (productId: number, quantity: number) => {
    if (user) {
      if (quantity <= 0) { await removeItem(productId); return; }
      await cartService.upsertCartItem(user.id, productId, quantity);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map((i: any) => ({ productId: i.product_id, quantity: i.quantity })));
    } else {
      setItems(prev => {
        const next = quantity <= 0
          ? prev.filter(i => i.productId !== productId)
          : prev.map(i => i.productId === productId ? { ...i, quantity } : i);
        setLocalCart(next);
        return next;
      });
    }
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    if (user) await cartService.clearCart(user.id);
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQty, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}
