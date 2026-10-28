import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Clock, Award, Building2, ChevronRight } from 'lucide-react';
import { getCategories } from '@/services/categories.service';
import { getProducts } from '@/services/products.service';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { HomePaginatedProducts } from '@/components/ui/HomePaginatedProducts';

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)

export default async function HomePage() {
  const [categories, allProducts] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. SECCIÓN HERO COMERCIAL */}
      <section className="relative bg-[#0F172A] text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        {/* Patrón de Fondo Decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Texto y Llamados a la Acción */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#0284C7] text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-[#F97316]" /> Proveedor Oficial para Entidades y Empresas
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Dotaciones y suministros <span className="text-[#0284C7]">para su empresa</span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                Soluciones integrales de abastecimiento en <strong className="text-white">Dotación laboral</strong>, <strong className="text-white">Ferretería</strong>, <strong className="text-white">Papelería corporativa</strong> y <strong className="text-white">Aseo industrial</strong>. Garantizamos calidad, cumplimiento y atención personalizada.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  href="/productos"
                  className="px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Ver Catálogo Completo <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#categorias"
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                >
                  Explorar Categorías
                </Link>
              </div>

              {/* Indicadores de Confianza */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-800 text-left">
                <div>
                  <span className="block text-2xl font-extrabold text-[#0284C7]">4</span>
                  <span className="text-xs text-slate-400">Líneas Especializadas</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#F97316]">100%</span>
                  <span className="text-xs text-slate-400">Garantía de Calidad</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-white">Rápido</span>
                  <span className="text-xs text-slate-400">Despacho Institucional</span>
                </div>
              </div>
            </div>

            {/* Banner Gráfico Promocional */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700 shadow-2xl bg-gradient-to-br from-slate-800 to-[#0F172A] p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono">PORTAFOLIO 2026</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0284C7]/20 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <h4 className="font-bold text-sm text-white">Dotación</h4>
                    <p className="text-[11px] text-slate-400">Calzado de seguridad, uniformes y EPP.</p>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <h4 className="font-bold text-sm text-white">Ferretería</h4>
                    <p className="text-[11px] text-slate-400">Herramientas e insumos técnicos.</p>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#1E40AF]/20 text-[#0284C7] flex items-center justify-center font-bold text-xs">
                      03
                    </div>
                    <h4 className="font-bold text-sm text-white">Papelería</h4>
                    <p className="text-[11px] text-slate-400">Resmas y útiles de oficina.</p>
                  </div>
                  <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-700 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                      04
                    </div>
                    <h4 className="font-bold text-sm text-white">Aseo</h4>
                    <p className="text-[11px] text-slate-400">Insumos y químicos industriales.</p>
                  </div>
                </div>

                <div className="bg-[#0284C7] text-white p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs block opacity-90">¿Requiere una cotización formal?</span>
                    <strong className="text-sm font-bold">Solicite en 3 sencillos pasos</strong>
                  </div>
                  <Link
                    href="/productos"
                    className="px-3 py-1.5 bg-white text-[#0F172A] text-xs font-bold rounded-lg hover:bg-slate-100 transition"
                  >
                    Cotizar
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VENTAJAS CORPORATIVAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Productos Certificados</h4>
              <p className="text-xs text-slate-500 mt-1">Cumplimos con normativas técnicas e industriales vigentes.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Despachos Eficientes</h4>
              <p className="text-xs text-slate-500 mt-1">Entrega oportuna directa en las instalaciones de su entidad.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Respuesta en 24h</h4>
              <p className="text-xs text-slate-500 mt-1">Cotizaciones formales procesadas con rapidez comercial.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Atención Personalizada</h4>
              <p className="text-xs text-slate-500 mt-1">Asesoría técnica para compras mayoristas y licitaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE CATEGORÍAS */}
      <section id="categorias" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <span className="text-[#0284C7] font-bold text-xs uppercase tracking-wider block">
              Nuestras Líneas Principales
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Explora por Categorías
            </h2>
          </div>
          <Link
            href="/productos"
            className="text-xs font-bold text-[#0F172A] hover:text-[#0284C7] flex items-center gap-1 transition"
          >
            Ver todos los productos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 4. PRODUCTOS DISPONIBLES CON PAGINACIÓN Y FILTROS */}
      <HomePaginatedProducts products={allProducts} categories={categories} itemsPerPage={8} />

      {/* 5. SECCIÓN ACERCA DE LA EMPRESA */}
      <section id="nosotros" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              Conozca Nuestra Trayectoria
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Su aliado estratégico en suministros institucionales
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              En <strong className="text-slate-900">DOTACIONES & SUMINISTROS</strong> nos especializamos en simplificar los procesos de compras y aprovisionamiento para entidades públicas y privadas. Consolidamos en una sola plataforma las cuatro grandes líneas que su organización necesita para operar sin interrupciones.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Trabajamos con estándares de calidad garantizados, ofreciendo precios competitivos, facturación legal y atención oportuna a sus solicitudes de cotización.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-800">
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl">✓ Dotación con Normativa</span>
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl">✓ Ferretería Técnico Industrial</span>
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl">✓ Insumos de Oficina</span>
              <span className="bg-slate-100 px-3.5 py-2 rounded-xl">✓ Desinfección Certificada</span>
            </div>
          </div>

          <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-gradient-to-br from-[#0F172A] to-[#1E40AF] p-8 flex flex-col justify-between text-white">
            <div className="space-y-2">
              <Building2 className="w-10 h-10 text-[#F97316]" />
              <h3 className="text-2xl font-bold">¿Necesita un pedido especial o volumen alto?</h3>
              <p className="text-xs text-slate-300">
                Nuestro equipo comercial le asesora con fichas técnicas y precios escala para compras al por mayor.
              </p>
            </div>
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl transition shadow-md w-fit"
            >
              Contactar Asesor Comercial
            </Link>
          </div>
        </div>
      </section>

      {/* 6. SECCIÓN CONTACTO */}
      <section id="contacto" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-[#0F172A] text-white rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="text-[#0284C7] font-bold text-xs uppercase tracking-wider block">
              Atención Directa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ¿Tiene dudas sobre nuestros productos o requerimientos especiales?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Puede navegar nuestro catálogo y generar su cotización en línea agregando productos al carrito, o contactarnos directamente para atención personalizada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs font-medium">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0284C7]/20 text-[#0284C7] flex items-center justify-center font-bold">
                  📞
                </div>
                <div>
                  <span className="block text-slate-400">Teléfono Directo:</span>
                  <span className="text-sm font-bold text-white">+57 320 843 8654</span>
                </div>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F97316]/20 text-[#F97316] flex items-center justify-center font-bold">
                  ✉️
                </div>
                <div>
                  <span className="block text-slate-400">Correo Electrónico:</span>
                  <span className="text-sm font-bold text-white">Dotacionessuministros16@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
