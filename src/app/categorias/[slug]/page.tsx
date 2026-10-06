import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryBySlug } from '@/services/categories.service';
import { getProducts } from '@/services/products.service';
import { ProductCard } from '@/components/ui/ProductCard';
import { Layers, ArrowLeft } from 'lucide-react';

interface CategorySlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export default async function CategorySlugPage({ params }: CategorySlugPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ categorySlug: slug });

  return (
    <div className="space-y-10 pb-16">
      
      {/* Banner de Categoría */}
      <section className="relative bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        <Image
          src={category.image_url || 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=1200'}
          alt={category.name}
          fill
          className="object-cover opacity-20"
        />
        <div className="relative z-10 max-w-7xl mx-auto space-y-4">
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#0284C7] transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a todas las categorías
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/30 border border-[#0284C7]/50 text-white text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#F97316]" /> Línea de Especialidad
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Categoría: <span className="text-[#0284C7]">{category.name}</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {category.description}
          </p>

          <div className="pt-2 text-xs font-bold text-slate-400">
            {products.length} {products.length === 1 ? 'Producto disponible' : 'Productos disponibles'} en esta categoría
          </div>
        </div>
      </section>

      {/* Lista de Productos de la Categoría */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No hay productos en esta categoría</h3>
            <p className="text-xs text-slate-500">
              Pronto añadiremos nuevos artículos para la línea de {category.name}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
