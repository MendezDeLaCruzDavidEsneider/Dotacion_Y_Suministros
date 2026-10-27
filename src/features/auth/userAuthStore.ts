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
        // Admin bypass: si password es undefined, credenciales ya validadas externamente
        if (password === undefined) {
          const userObj: UserSession = {
            name: name || 'Usuario Administrador',
            email,
            company: company || 'DOTACIONES & SUMINISTROS',
            role,
          };
          set({ user: userObj, showLoginModal: false });
          return;
        }

        try {
          const supabase = createClient();
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            console.error('[Supabase Auth Login Error]:', error);
            throw new Error(error.message);
          }

          if (!data?.user) {
            throw new Error('No se pudo obtener la información del usuario autenticado.');
          }

          // Intentar obtener perfil desde public.profiles
          let profileData: { full_name?: string; company?: string; phone?: string; role?: 'ADMIN' | 'USER' } | null = null;
          try {
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('full_name, company, phone, role')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileErr) {
              console.warn('[Supabase Profile Query Warning]:', profileErr.message);
            } else if (profile) {
              profileData = profile;
            }
          } catch (pErr) {
            console.warn('[Supabase Profile Read Exception]:', pErr);
          }

          const userMeta = data.user.user_metadata || {};

          const userObj: UserSession = {
            name: profileData?.full_name || userMeta.full_name || email.split('@')[0],
            email: data.user.email || email,
            company: profileData?.company || userMeta.company || 'Empresa Solicitante',
            phone: profileData?.phone || userMeta.phone || '',
            role: profileData?.role || 'USER',
          };

          set({ user: userObj, showLoginModal: false });
        } catch (err: any) {
          console.error('[UserAuthStore Login Failure]:', err);
          throw err;
        }
      },

      signUp: async (email: string, password: string, name = 'Usuario Cliente', company = 'Empresa Solicitante', phone = '', role: 'ADMIN' | 'USER' = 'USER') => {
        try {
          const supabase = createClient();

          // signUp con metadatos de usuario
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
            console.error('[Supabase SignUp Error]:', error);
            if (error.message?.includes('Database error saving new user')) {
              throw new Error(
                'Error en la base de datos al registrar nuevo usuario. Por favor ejecuta el script "schema_update_and_fix.sql" en el editor SQL de Supabase para solucionar las políticas RLS y el trigger.'
              );
            }
            throw new Error(error.message);
          }

          const assignedRole: 'ADMIN' | 'USER' = role;

          // Si hay sesión activa inmediata y se obtuvo ID de usuario, intentar actualizar perfil
          if (data?.user?.id && data.session) {
            try {
              const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                  id: data.user.id,
                  full_name: name,
                  email,
                  company,
                  phone,
                  role: assignedRole,
                  updated_at: new Date().toISOString(),
                });

              if (updateError) {
                console.warn('[Profile Upsert Warning]:', updateError.message);
              }
            } catch (uErr) {
              console.warn('[Profile Upsert Exception]:', uErr);
            }
          }

          const userObj: UserSession = { name, email, company, phone, role: assignedRole };
          set({ user: userObj, showLoginModal: false });
        } catch (err: any) {
          console.error('[UserAuthStore SignUp Failure]:', err);
          throw err;
        }
      },

      logout: async () => {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('[Supabase SignOut Exception]:', e);
        }
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
