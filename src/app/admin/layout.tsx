'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Layers, ShoppingBag, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Si por alguna razón está en /admin/login, redirigir a /login
  if (pathname === '/admin/login') {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const handleSignOut = async () => {
    // Borrar cookie de sesión administrativa
    document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    try {
      localStorage.removeItem('admin_session');
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignorar error local
    }
    window.location.href = '/login';
  };

  const navItems = [
    { label: 'Dashboard & Reporte PDF', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Gestión de Productos', href: '/admin/productos', icon: Package },
    { label: 'Categorías', href: '/admin/categorias', icon: Layers },
    { label: 'Pedidos / Cotizaciones', href: '/admin/pedidos', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Administrativo */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        
        {/* Header con Logo Oficial en Admin */}
        <div className="p-5 border-b border-slate-800">
          <Logo variant="light" size="sm" showSubtitle={false} />
          <span className="text-[10px] font-extrabold text-[#F97316] uppercase tracking-wider block mt-2">
            PANEL DE CONTROL ADMINISTRATIVO
          </span>
        </div>

        {/* Links de Navegación */}
        <nav className="flex-1 p-4 space-y-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-[#0284C7] text-white font-bold shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer del Sidebar con Acciones de Salida */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition rounded-lg hover:bg-slate-800"
          >
            <ExternalLink className="w-4 h-4 text-[#F97316]" /> Ver Tienda Pública
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 transition rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" /> Cerrar Sesión Admin
          </button>
        </div>
      </aside>

      {/* Contenido Principal de Admin */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0284C7]" /> Sesión Administrativa Privada Activa
            </span>
            <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-semibold">
              Administradora: Estefanía Contreras
            </span>
          </div>

          {children}
        </div>
      </main>

    </div>
  );
}
