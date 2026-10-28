import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-slate-300 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Identidad de la Empresa con Logo Oficial */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Comercialización y suministro integral de dotación laboral, ferretería, papelería e insumos de aseo para entidades públicas, corporativas e industrias.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#0284C7] font-medium pt-2">
              <ShieldCheck className="w-4 h-4 text-[#F97316]" />
              Proveedor registrado y confiable
            </div>
          </div>

          {/* Categorías Principales */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Categorías Comercializadas
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/categorias/dotacion" className="hover:text-[#0284C7] transition">
                  Dotación e Indumentaria Laboral
                </Link>
              </li>
              <li>
                <Link href="/categorias/ferreteria" className="hover:text-[#0284C7] transition">
                  Ferretería y Mantenimiento Industrial
                </Link>
              </li>
              <li>
                <Link href="/categorias/papeleria" className="hover:text-[#0284C7] transition">
                  Papelería e Insumos de Oficina
                </Link>
              </li>
              <li>
                <Link href="/categorias/aseo" className="hover:text-[#0284C7] transition">
                  Aseo, Higiene y Desinfección
                </Link>
              </li>
            </ul>
          </div>

          {/* Información Comercial */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Atención a Clientes
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F97316] shrink-0 mt-0.5" />
                <span></span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>+57 320 8438654</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F97316] shrink-0" />
                <span>Dotacionessuministros16@gmail.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#0284C7] shrink-0" />
                <span>Lunes a Viernes: 7:00 AM - 5:00 PM /Sabados: 8:00 AM - 1:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Enlaces de Interés / Accesos */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Navegación Rápida
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/productos" className="hover:text-[#0284C7] transition">
                  Catálogo General de Productos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="hover:text-[#0284C7] transition">
                  Mi Carrito de Cotización
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="hover:text-[#0284C7] transition">
                  Acerca de Nuestra Empresa
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DOTACIONES & SUMINISTROS. Todos los derechos reservados.</p>
          <p>Plataforma de Catálogo Comercial y Cotización Empresarial.</p>
        </div>
      </div>
    </footer>
  );
}
