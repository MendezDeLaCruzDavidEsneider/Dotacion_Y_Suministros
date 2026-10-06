import React from 'react';
import { getProducts } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { ProductCard } from '@/components/ui/ProductCard';
import Link from 'next/link';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{
    categoria?: string;
    buscar?: string;
    orden?: string;
  }>;
}

export const revalidate = 30;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.categoria;
  const searchQuery = resolvedParams.buscar;
  const sortBy = (resolvedParams.orden as 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest') || 'newest';

  const [products, categories] = await Promise.all([
    getProducts({
      categorySlug,
      searchQuery,
      sortBy,
    }),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Catálogo Comercial de Productos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore nuestros insumos de dotación, ferretería, papelería y aseo para su organización.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
          Mostrando {products.length} productos
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Barra Lateral de Filtros */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Filter className="w-4 h-4 text-[#0284C7]" />
              <h2 className="font-bold text-sm text-slate-900">Filtrar por Categoría</h2>
            </div>

            <div className="space-y-1.5 text-xs">
              <Link
                href="/productos"
                className={`block px-3 py-2 rounded-xl font-medium transition ${
                  !categorySlug
                    ? 'bg-[#0F172A] text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Todas las categorías
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/productos?categoria=${cat.slug}${searchQuery ? `&buscar=${searchQuery}` : ''}`}
                  className={`block px-3 py-2 rounded-xl font-medium transition ${
                    categorySlug === cat.slug
                      ? 'bg-[#0284C7] text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Ordenamiento */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F97316]" />
                <h3 className="font-bold text-sm text-slate-900">Ordenar Por</h3>
              </div>

              <div className="space-y-1.5 text-xs font-medium">
                <Link
                  href={`/productos?${categorySlug ? `categoria=${categorySlug}&` : ''}orden=newest${searchQuery ? `&buscar=${searchQuery}` : ''}`}
                  className={`block px-3 py-2 rounded-xl transition ${sortBy === 'newest' ? 'bg-slate-100 text-[#0F172A] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Más recientes
                </Link>
                <Link
                  href={`/productos?${categorySlug ? `categoria=${categorySlug}&` : ''}orden=price-asc${searchQuery ? `&buscar=${searchQuery}` : ''}`}
                  className={`block px-3 py-2 rounded-xl transition ${sortBy === 'price-asc' ? 'bg-slate-100 text-[#0F172A] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Precio: Menor a Mayor
                </Link>
                <Link
                  href={`/productos?${categorySlug ? `categoria=${categorySlug}&` : ''}orden=price-desc${searchQuery ? `&buscar=${searchQuery}` : ''}`}
                  className={`block px-3 py-2 rounded-xl transition ${sortBy === 'price-desc' ? 'bg-slate-100 text-[#0F172A] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Precio: Mayor a Menor
                </Link>
                <Link
                  href={`/productos?${categorySlug ? `categoria=${categorySlug}&` : ''}orden=name-asc${searchQuery ? `&buscar=${searchQuery}` : ''}`}
                  className={`block px-3 py-2 rounded-xl transition ${sortBy === 'name-asc' ? 'bg-slate-100 text-[#0F172A] font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Nombre: A-Z
                </Link>
              </div>
            </div>

          </div>
        </aside>

        {/* Grilla de Productos */}
        <main className="lg:col-span-3 space-y-6">
          
          {searchQuery && (
            <div className="bg-[#0284C7]/10 border border-[#0284C7]/20 p-4 rounded-xl flex items-center justify-between text-xs text-[#0F172A]">
              <span>Resultados para la búsqueda: <strong>&quot;{searchQuery}&quot;</strong></span>
              <Link href="/productos" className="font-bold underline hover:text-[#0284C7]">
                Limpiar Búsqueda
              </Link>
            </div>
          )}

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <Search className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No se encontraron productos</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No existen coincidencias con los filtros o término de búsqueda aplicado. Pruebe seleccionando otra categoría.
              </p>
              <Link
                href="/productos"
                className="inline-block px-4 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#0284C7] transition"
              >
                Restablecer Filtros
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
