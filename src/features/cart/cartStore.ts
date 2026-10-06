'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantityToAdd = 1) => {
        if (!product.active || quantityToAdd <= 0) return;

        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingIndex].quantity + quantityToAdd;
          const maxStock = product.stock > 0 ? product.stock : 999;
          
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: Math.min(newQty, maxStock),
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          const initialQty = Math.min(quantityToAdd, product.stock > 0 ? product.stock : 999);
          set({
            items: [...currentItems, { product, quantity: initialQty }],
            isOpen: true,
          });
        }
      },

      updateQuantity: (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const itemToUpdate = currentItems.find((i) => i.product.id === productId);
        if (!itemToUpdate) return;

        const maxStock = itemToUpdate.product.stock > 0 ? itemToUpdate.product.stock : 999;
        const finalQty = Math.min(newQuantity, maxStock);

        set({
          items: currentItems.map((item) =>
            item.product.id === productId ? { ...item, quantity: finalQty } : item
          ),
        });
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },

      getTotal: () => {
        // En esta primera versión el total equivale al subtotal (sin impuestos/envío dinámico adicional)
        return get().getSubtotal();
      },
    }),
    {
      name: 'dotaciones_cart_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
