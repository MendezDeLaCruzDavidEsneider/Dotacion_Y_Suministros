'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User, Building2, Phone, ShieldCheck, ArrowRight, UserPlus, LogIn, Loader2 } from 'lucide-react';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { useCartStore } from '@/features/cart/cartStore';
import { Logo } from '@/components/ui/Logo';
import { useHydration } from '@/lib/useHydration';

export function LoginModal() {
  const hasMounted = useHydration();
  const { showLoginModal, closeLoginModal, login, pendingProductToAdd } = useUserAuthStore();
  const { addItem } = useCartStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Estado de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Estado de Registro
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!hasMounted || !showLoginModal) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail || !cleanPassword) return;

    // Admin bypass (hardcoded admin credentials)
    if (cleanEmail === 'estefaniacontreras@gmail.com') {
      if (cleanPassword === '132604') {
        document.cookie = 'admin_session=true; path=/; max-age=86400';
        try { localStorage.setItem('admin_session', 'true'); } catch {}
        login(cleanEmail, undefined, 'Estefanía Contreras', 'DOTACIONES & SUMINISTROS', 'ADMIN');
        closeLoginModal();
        window.location.href = '/admin/dashboard';
        return;
      } else {
        setErrorMessage('Contraseña incorrecta para el usuario administrador.');
        return;
      }
    }

    // Login normal contra Supabase
    setLoading(true);
    try {
      await login(cleanEmail, cleanPassword);
      if (pendingProductToAdd) {
        addItem(pendingProductToAdd.product, pendingProductToAdd.quantity || 1);
      }
      closeLoginModal();
    } catch (err: any) {
      const msg: string = err?.message || '';
      if (msg.toLowerCase().includes('invalid login credentials') || msg.toLowerCase().includes('invalid credentials')) {
        setErrorMessage('Correo o contraseña incorrectos. Si acaba de registrarse, verifique si su cuenta requiere confirmación por correo electrónico.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMessage('Debe confirmar su correo electrónico antes de iniciar sesión. Revise su bandeja de entrada.');
      } else {
        setErrorMessage(msg || 'Error al iniciar sesión con Supabase. Intente de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setMessage(null);
    if (!regEmail.trim() || !regName.trim() || !regPassword.trim()) {
      setErrorMessage('Por favor complete todos los campos obligatorios (*).');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { signUp } = useUserAuthStore.getState();
    try {
      await signUp(regEmail.trim(), regPassword.trim(), regName.trim(), regCompany.trim(), regPhone.trim(), 'USER');
      setMessage('¡Cuenta creada e iniciada exitosamente en la base de datos!');
      if (pendingProductToAdd) {
        addItem(pendingProductToAdd.product, pendingProductToAdd.quantity || 1);
      }
      setTimeout(() => {
        closeLoginModal();
      }, 1000);
    } catch (err: any) {
      console.error('[Register Form Submit Error]:', err);
      setErrorMessage(err?.message || 'Error al conectar con la base de datos de Supabase para registrar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay Oscuro */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeLoginModal}
      />

      {/* Contenido del Modal */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 space-y-6">
        {/* Botón de Cierre */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Logo Oficial */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="md" />
          </div>
          <div className="bg-[#0284C7]/10 border border-[#0284C7]/20 p-3 rounded-2xl text-xs text-[#0F172A] font-semibold flex items-center gap-2 text-left">
            <ShieldCheck className="w-5 h-5 text-[#0284C7] shrink-0" />
            <span>Regístrese o inicie sesión para agregar productos al carrito y cotizar.</span>
          </div>
        </div>

        {/* Pestañas de Navegación: Iniciar Sesión vs Crear Cuenta */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'login'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5 text-[#0284C7]" /> Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'register'
                ? 'bg-white text-[#0F172A] shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5 text-[#F97316]" /> Crear Cuenta
          </button>
        </div>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {/* TAB 1: FORMULARIO DE INICIO DE SESIÓN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Correo Electrónico Registrado *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0284C7] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="compras@empresa.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Contraseña *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#0F172A] hover:bg-[#0284C7] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verificando credenciales...
                </>
              ) : (
                <>
                  Ingresar y Continuar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: FORMULARIO DE REGISTRO DE NUEVO USUARIO */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ej. Carolina Mendoza"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Correo Electrónico Corporativo *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0284C7] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="compras@miempresa.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Empresa / Entidad *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={regCompany}
                    onChange={(e) => setRegCompany(e.target.value)}
                    placeholder="Empresa S.A.S."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+57 300 000"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Crear Contraseña *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creando cuenta en base de datos...
                </>
              ) : (
                <>
                  Registrar Cuenta y Continuar <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
          DOTACIONES & SUMINISTROS — Plataforma Comercial Empresarial
        </div>
      </div>
    </div>
  );
}
