'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { Logo } from '@/components/ui/Logo';
import { Mail, Lock, User, Building2, Phone, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function UserLoginPage() {
  const router = useRouter();
  const { login } = useUserAuthStore();

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

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanEmail) return;

    // Verificación de credenciales de Administradora
    if (cleanEmail === 'estefaniacontreras@gmail.com') {
      if (cleanPassword === '132604') {
        // Asignar sesión administrativa
        document.cookie = 'admin_session=true; path=/; max-age=86400';
        try {
          localStorage.setItem('admin_session', 'true');
        } catch {}

        login('estefaniacontreras@gmail.com', 'Estefanía Contreras', 'DOTACIONES & SUMINISTROS', 'ADMIN');
        window.location.href = '/admin/dashboard';
        return;
      } else {
        setErrorMessage('Contraseña incorrecta para el usuario administrador.');
        return;
      }
    }

    // Acceso para clientes generales
    login(cleanEmail, 'Cliente Registrado', '', 'USER');
    router.push('/productos');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regEmail.trim() || !regName.trim()) return;

    setMessage('¡Cuenta registrada exitosamente!');
    login(regEmail.trim(), regName.trim(), regCompany.trim(), 'USER');
    router.push('/productos');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        
        {/* Logo Oficial */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
            Acceso a la Plataforma
          </h1>
          <p className="text-xs text-slate-500">
            Inicie sesión con su cuenta de cliente o credenciales de administración.
          </p>
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
                  placeholder="compras@miempresa.com"
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
              className="w-full py-3.5 px-4 bg-[#0F172A] hover:bg-[#0284C7] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              Iniciar Sesión <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: FORMULARIO DE REGISTRO (CREAR CUENTA) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nombre Completo de Contacto *
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
                    placeholder="Nombre Empresa"
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
                Contraseña de Acceso *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crear contraseña"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              Crear Cuenta y Explorar <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="bg-slate-100 p-3 rounded-xl text-[11px] text-slate-600 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0284C7] shrink-0" />
          <span>Acceso seguro para cotizaciones de insumos institucionales.</span>
        </div>
      </div>
    </div>
  );
}
