'use client';

import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
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
  login: (email: string, password?: string, name?: string, company?: string, role?: 'ADMIN' | 'USER') => Promise<void>;
  signUp: (email: string, password: string, name?: string, company?: string, phone?: string, role?: 'ADMIN' | 'USER') => Promise<void>;
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

      login: async (email: string, password?: string, name?: string, company?: string, role: 'ADMIN' | 'USER' = 'USER') => {
        // Admin bypass: if password is undefined, assume credentials already validated externally
        if (password === undefined) {
          const userObj: UserSession = {
            name: name || 'Usuario Cliente',
            email,
            company: company || 'Empresa Solicitante',
            role,
          };
          set({ user: userObj, showLoginModal: false });
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error('Supabase login error:', error);
          throw new Error(error.message);
        }

        // Fetch profile data
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('full_name, company, role')
          .eq('id', data.user?.id)
          .single();

        if (profileErr) {
          console.error('Profile fetch error:', profileErr);
        }

        const userObj: UserSession = {
          name: (profile && profile.full_name) || 'Usuario Cliente',
          email,
          company: (profile && profile.company) || 'Empresa Solicitante',
          role: (profile && profile.role) || 'USER',
        };

        set({ user: userObj, showLoginModal: false });
      },

      signUp: async (email: string, password: string, name = 'Usuario Cliente', company = 'Empresa Solicitante', phone = '', role: 'ADMIN' | 'USER' = 'USER') => {
        const supabase = createClient();

        // signUp con metadatos — el trigger de Supabase creará el registro en profiles automáticamente
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              company,
              phone,
            },
          },
        });

        if (error) {
          console.error('Supabase signUp error:', error);
          throw new Error(error.message);
        }

        const adminEmails = process.env.NEXT_PUBLIC_ADMINS?.split(',').map((e) => e.trim()) ?? [];
        const assignedRole: 'ADMIN' | 'USER' = adminEmails.includes(email) ? 'ADMIN' : 'USER';

        // Actualizar el perfil con todos los datos (el trigger ya insertó la fila básica)
        if (data?.user?.id) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ full_name: name, company, phone, role: assignedRole })
            .eq('id', data.user.id);

          if (updateError) {
            console.warn('Profile update warning:', updateError.message);
          }
        }

        const userObj: UserSession = { name, email, company, phone, role: assignedRole };
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
