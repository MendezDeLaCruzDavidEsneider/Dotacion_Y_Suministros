'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/features/cart/cartStore';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { useHydration } from '@/lib/useHydration';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const hasMounted = useHydration();
  const { addItem } = useCartStore();
  const { isAuthenticated, openLoginModal } = useUserAuthStore();

  const isAvailable = product.active && product.stock > 0;

  const handleAddToCart = () => {
    // REQUISITO: Exigir inicio de sesión antes de agregar al carrito
    if (hasMounted && !isAuthenticated()) {
      openLoginModal({ product, quantity: 1 });
      return;
    }
    addItem(product, 1);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full">
      {/* Imagen Principal y Badges */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        <Image
          src={
            product.main_image_url ||
            'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=600'
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge de Categoría */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-[#0F172A]/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.category.name}
          </span>
        )}

        {/* Badge de Destacado */}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-[#F97316] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
            Destacado
          </span>
        )}
      </div>

      {/* Cuerpo de Información */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Disponibilidad */}
          <div className="flex items-center gap-1.5 mb-2">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> En Stock ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                <AlertCircle className="w-3 h-3" /> Cotizar bajo pedido
              </span>
            )}
          </div>

          {/* Nombre del Producto */}
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0284C7] transition line-clamp-2">
            <Link href={`/productos/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Descripción Corta */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Precio y Botones de Acción */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-[11px] font-medium text-slate-400 uppercase">Precio Unitario</span>
            {product.discount && product.discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="line-through text-sm text-slate-500">{formatCurrency(product.price)}</span>
                <span className="text-lg font-extrabold text-[#0F172A]">{formatCurrency(product.price * (1 - product.discount / 100))}</span>
                <span className="text-xs font-medium text-[#F97316]">-{product.discount}%</span>
              </div>
            ) : (
              <span className="text-lg font-extrabold text-[#0F172A]">{formatCurrency(product.price)}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/productos/${product.slug}`}
              className="py-2.5 px-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" /> Ver Detalle
            </Link>

            <button
              onClick={handleAddToCart}
              className="py-2.5 px-3 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
