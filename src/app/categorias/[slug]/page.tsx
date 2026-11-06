import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryBySlug } from '@/services/categories.service';
import { getProducts } from '@/services/products.service';
import { ProductCard } from '@/components/ui/ProductCard';
import { Layers, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

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
  // Usar la imagen de la categoría o del primer producto real disponible
  const categoryImage = category.image_url || products[0]?.main_image_url || 'https://www.abastece.co/abastece/images/1293.jpg';

  return (
    <div className="space-y-10 pb-16">
      
      {/* Banner de Categoría con Producto Representativo */}
      <section className="relative bg-[#0F172A] text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 overflow-hidden">
        {/* Patrón de puntos decorativo */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0284C7_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Resplandor luminoso */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Textos y Datos de la Categoría */}
          <div className="space-y-4 max-w-2xl">
            <Link
              href="/#categorias"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#0284C7] transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a todas las categorías
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-[#F97316]" /> Línea Institucional
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Disponibilidad Inmediata
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Línea: <span className="text-[#0284C7]">{category.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {category.description}
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-bold text-slate-400">
              <span className="bg-slate-800 text-white px-3 py-1.5 rounded-lg border border-slate-700">
                {products.length.toLocaleString('es-CO')} {products.length === 1 ? 'Producto disponible' : 'Productos disponibles'}
              </span>
              <span className="text-slate-500">• Cotización formal para empresas</span>
            </div>
          </div>

          {/* Caja con la Imagen Real de Producto de la Categoría */}
          <div className="shrink-0 self-center md:self-auto">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 bg-white rounded-3xl p-4 shadow-2xl border-2 border-slate-700/80 flex items-center justify-center overflow-hidden">
              <Image
                src={categoryImage}
                alt={`Línea ${category.name}`}
                fill
                sizes="(max-width: 768px) 180px, 220px"
                className="object-contain p-3 mix-blend-multiply"
                priority
              />
              <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                Foto Real
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Lista de Productos de la Categoría */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F97316]" /> Catálogo Completo de {category.name}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Mostrando {products.length.toLocaleString('es-CO')} productos
          </span>
        </div>

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
