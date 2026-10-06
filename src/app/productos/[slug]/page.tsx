import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getRelatedProducts } from '@/services/products.service';
import { ProductCard } from '@/components/ui/ProductCard';
import { ProductDetailClient } from '@/features/products/ProductDetailClient';
import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface ProductSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;

export default async function ProductSlugPage({ params }: ProductSlugPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb / Navegación */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto">
        <Link href="/" className="hover:text-[#0284C7] shrink-0">Inicio</Link>
        <ChevronRight className="w-3 h-3 shrink-0" />
        <Link href="/productos" className="hover:text-[#0284C7] shrink-0">Productos</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href={`/categorias/${product.category.slug}`} className="hover:text-[#0284C7] shrink-0">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 shrink-0" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Componente Cliente para Galería e Interacción de Compra */}
      <ProductDetailClient product={product} />

      {/* Garantía e Información Comercial Adicional */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0284C7]/10 text-[#0284C7] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Garantía Directa</h4>
            <p className="text-slate-500 mt-0.5">Respaldamos cada insumo entregado a su empresa.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center font-bold">
            📜
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Ficha Técnica Oficial</h4>
            <p className="text-slate-500 mt-0.5">Consulte especificaciones y certificados.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F172A]/10 text-[#0F172A] flex items-center justify-center font-bold">
            📦
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Despacho Institucional</h4>
            <p className="text-slate-500 mt-0.5">Envíos consolidados a bodegas y sedes.</p>
          </div>
        </div>
      </div>

      {/* Productos Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                Complemente su Solicitud
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Productos Relacionados
              </h2>
            </div>
            {product.category && (
              <Link
                href={`/categorias/${product.category.slug}`}
                className="text-xs font-bold text-[#0F172A] hover:text-[#0284C7] flex items-center gap-1"
              >
                Ver más de {product.category.name} <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
