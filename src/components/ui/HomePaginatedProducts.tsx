'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';

interface HomePaginatedProductsProps {
  products: Product[];
  categories: Category[];
  itemsPerPage?: number;
}

export function HomePaginatedProducts({
  products,
  categories,
  itemsPerPage = 8,
}: HomePaginatedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filtrar productos según la categoría seleccionada
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter((p) => p.category?.slug === selectedCategory);
  }, [products, selectedCategory]);

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Cambiar categoría y reiniciar a la página 1
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  // Cambiar página con scroll suave
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (sectionRef.current) {
      const topOffset = sectionRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  // Contadores por categoría
  const getCategoryCount = (slug: string) => {
    if (slug === 'all') return products.length;
    return products.filter((p) => p.category?.slug === slug).length;
  };

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
      {/* Encabezado de la Sección */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[#F97316] font-extrabold text-xs uppercase tracking-wider bg-orange-50 border border-orange-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Catálogo Organizado
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Nuestros Productos Disponibles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Explore de forma ordenada nuestras líneas institucionales con disponibilidad en stock y cotización formal inmediata.
          </p>
        </div>

        <Link
          href="/productos"
          className="text-xs font-bold text-[#0F172A] hover:text-[#0284C7] flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl transition shadow-2xs"
        >
          Ver todo el catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Pestañas de Filtro Rápido por Línea de Negocio */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#0F172A] text-white shadow-md'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Todos ({products.length})</span>
        </button>

        {categories.map((cat) => {
          const count = getCategoryCount(cat.slug);
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#0284C7] text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Productos Paginados */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <p className="text-sm font-bold text-slate-700">No hay productos en esta categoría por el momento.</p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="text-xs text-[#0284C7] font-bold hover:underline"
          >
            Ver todas las categorías
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Barra de Paginación y Control de Visualización */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Indicador de Rango */}
          <span className="text-xs font-medium text-slate-500">
            Mostrando <strong className="text-slate-900">{startIndex + 1} - {endIndex}</strong> de{' '}
            <strong className="text-slate-900">{filteredProducts.length}</strong> productos
          </span>

          {/* Controles de Navegación de Páginas */}
          <div className="flex items-center gap-1.5">
            {/* Botón Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Números de Página */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#0284C7] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
