'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Building2,
  ChevronDown,
  User,
  LogOut,
  Layers,
  Wrench,
  FileText,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { Logo } from '@/components/ui/Logo';
import { useHydration } from '@/lib/useHydration';

export function Header() {
  const hasMounted = useHydration();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { toggleCart, getTotalItems } = useCartStore();
  const { user, openLoginModal, logout } = useUserAuthStore();
  const totalItems = hasMounted ? getTotalItems() : 0;
  const currentUser = hasMounted ? user : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/productos?buscar=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* 1. BARRA SUPERIOR INFORMATIVA */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7]" />
              Suministros e Insumos Empresariales Directos
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-[#F97316]" />
              Atención a Entidades Públicas y Privadas
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <a href="tel:+573000000000" className="hover:text-white flex items-center gap-1 transition">
              <Phone className="w-3 h-3 text-[#0284C7]" />
              +57 300 000 0000
            </a>
            <a href="mailto:ventas@dotacionesysuministros.com" className="hover:text-white flex items-center gap-1 transition">
              <Mail className="w-3 h-3 text-[#F97316]" />
              ventas@dotacionesysuministros.com
            </a>
          </div>
        </div>
      </div>

      {/* 2. HEADER PRINCIPAL CON NAVEGACIÓN Y DROPDOWN HACIA ABAJO */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Oficial de la Empresa */}
          <Logo size="md" />

          {/* Buscador Central (Desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por producto, ferretería, dotación..."
              className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0284C7] focus:bg-white transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-[#0F172A] text-white rounded-lg hover:bg-[#0284C7] transition flex items-center justify-center"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Menú de Navegación con Desplegable hacia Abajo */}
          <nav className="hidden md:flex items-center gap-6 font-semibold text-xs text-slate-700">
            <Link href="/" className="hover:text-[#0284C7] transition">
              Inicio
            </Link>

            {/* MENÚ DESPLEGABLE DE CATEGORÍAS (HACIA ABAJO) */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center gap-1 py-2 hover:text-[#0284C7] transition focus:outline-hidden"
              >
                <span>Categorías</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#F97316] transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Panel Desplegable hacia Abajo */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase px-3 py-1 tracking-wider border-b border-slate-100 mb-1">
                    Líneas de Negocio
                  </div>

                  <Link
                    href="/categorias/dotacion"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center group-hover:bg-[#0F172A] group-hover:text-white transition">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-[#0284C7] transition">Dotación</span>
                      <span className="text-[10px] text-slate-500">Uniformes, calzado y EPP</span>
                    </div>
                  </Link>

                  <Link
                    href="/categorias/ferreteria"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center group-hover:bg-[#F97316] group-hover:text-white transition">
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-[#F97316] transition">Ferretería</span>
                      <span className="text-[10px] text-slate-500">Herramientas e insumos</span>
                    </div>
                  </Link>

                  <Link
                    href="/categorias/papeleria"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center group-hover:bg-[#0284C7] group-hover:text-white transition">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-[#0284C7] transition">Papelería</span>
                      <span className="text-[10px] text-slate-500">Resmas y útiles de oficina</span>
                    </div>
                  </Link>

                  <Link
                    href="/categorias/aseo"
                    onClick={() => setCategoryDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block group-hover:text-emerald-600 transition">Aseo</span>
                      <span className="text-[10px] text-slate-500">Limpieza y desinfección</span>
                    </div>
                  </Link>

                  <div className="pt-2 border-t border-slate-100 mt-1 px-3">
                    <Link
                      href="/productos"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="text-center block text-xs font-bold text-[#0284C7] hover:underline"
                    >
                      Ver Todo el Catálogo →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/productos" className="hover:text-[#0284C7] transition">
              Catálogo
            </Link>
            <Link href="/#nosotros" className="hover:text-[#0284C7] transition">
              Nosotros
            </Link>
            <Link href="/#contacto" className="hover:text-[#0284C7] transition">
              Contacto
            </Link>
          </nav>

          {/* Acciones de Usuario y Carrito */}
          <div className="flex items-center gap-4">
            
            {/* Estado de Usuario (Sesión de Cliente) */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/historial-servicios"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#0284C7]/10 hover:bg-[#0284C7]/20 text-[#0284C7] font-bold text-xs rounded-xl transition border border-[#0284C7]/20"
                  title="Ver mis pedidos y servicios"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Mis Servicios</span>
                </Link>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 pr-2.5 rounded-xl border border-slate-200">
                  <Link
                    href="/historial-servicios"
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden xl:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">{currentUser.name}</span>
                      <span className="text-[9px] text-slate-500 truncate max-w-[120px]">{currentUser.company || currentUser.email}</span>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-1 text-slate-400 hover:text-red-600 transition"
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-[#0284C7]" /> Iniciar Sesión
              </button>
            )}

            {/* Icono del Carrito */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-slate-700 hover:text-[#0284C7] hover:bg-slate-100 rounded-xl transition"
              aria-label="Ver Carrito de Pedido"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F97316] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Menú Móvil Botón */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-[#0284C7]"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
            />
            <button type="submit" className="absolute right-2 top-2 text-slate-500 hover:text-[#0284C7]">
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-slate-50 rounded-md">
              Inicio
            </Link>
            <div className="pl-2 border-l-2 border-[#0284C7] space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Categorías</span>
              <Link href="/categorias/dotacion" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-[#0284C7]">
                Dotación
              </Link>
              <Link href="/categorias/ferreteria" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-[#0284C7]">
                Ferretería
              </Link>
              <Link href="/categorias/papeleria" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-[#0284C7]">
                Papelería
              </Link>
              <Link href="/categorias/aseo" onClick={() => setMobileMenuOpen(false)} className="block text-slate-700 hover:text-[#0284C7]">
                Aseo
              </Link>
            </div>
            <Link href="/productos" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 hover:bg-slate-50 rounded-md">
              Catálogo Completo
            </Link>
            {currentUser && (
              <Link href="/historial-servicios" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 text-[#0284C7] font-bold hover:bg-slate-50 rounded-md flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Mis Servicios y Pedidos
              </Link>
            )}
            <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-2 py-1.5 text-slate-500 hover:bg-slate-50 rounded-md">
              Panel Administrativo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
