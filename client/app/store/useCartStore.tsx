// stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IProduct } from '~/types/Products';

type CartItem = IProduct & { quantity: number };

interface CartState {
    items: CartItem[];
    addToCart: (product: IProduct, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    getQuantity: (productId: number) => number;
    updateQuantity: (id: number, quantity: number) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product, quantity) => {
                const currentItems = get().items;
                const existing = currentItems.find(p => p.id === product.id);
                if (existing) {
                    set({
                        items: currentItems.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: quantity ? item.quantity + quantity : item.quantity + 1 }
                                : item
                        )
                    });
                } else {
                    set({
                        items: [...currentItems, { ...product, quantity: quantity ? quantity : 1 }]
                    });
                }
            },

            removeFromCart: (productId) => {
                const currentItems = get().items;
                set({
                    items: currentItems.filter(item => item.id !== productId)
                });
            },

            clearCart: () => set({ items: [] }),

            getQuantity: (productId) => {
                const product = get().items.find(item => item.id === productId);
                return product ? product.quantity : 0;
            },
            updateQuantity: (id, quantity) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                }));
            },
        }),
        {
            name: 'cart-storage', // clave del localStorage
        }
    )
);
