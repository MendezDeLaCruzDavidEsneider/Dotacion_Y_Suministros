'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserSession {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: 'ADMIN' | 'USER';
}

interface UserAuthState {
  user: UserSession | null;
  showLoginModal: boolean;
  pendingProductToAdd: any | null;
  openLoginModal: (productToPendingAdd?: any) => void;
  closeLoginModal: () => void;
  login: (email: string, name?: string, company?: string, role?: 'ADMIN' | 'USER') => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useUserAuthStore = create<UserAuthState>()(
  persist(
    (set, get) => ({
      user: null,
      showLoginModal: false,
      pendingProductToAdd: null,

      openLoginModal: (productToPendingAdd = null) => {
        set({ showLoginModal: true, pendingProductToAdd: productToPendingAdd });
      },

      closeLoginModal: () => {
        set({ showLoginModal: false, pendingProductToAdd: null });
      },

      login: (email: string, name = 'Usuario Cliente', company = 'Empresa Solicitante', role: 'ADMIN' | 'USER' = 'USER') => {
        const userObj: UserSession = {
          name: name || 'Usuario Cliente',
          email: email,
          company: company || 'Empresa Solicitante',
          role: role,
        };
        set({ user: userObj, showLoginModal: false });
      },

      logout: () => {
        try {
          document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
          localStorage.removeItem('admin_session');
        } catch {}
        set({ user: null, showLoginModal: false, pendingProductToAdd: null });
      },

      isAuthenticated: () => {
        return get().user !== null;
      },

      isAdmin: () => {
        return get().user?.role === 'ADMIN';
      },
    }),
    {
      name: 'dotaciones_user_auth_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
