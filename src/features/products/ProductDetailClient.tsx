'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, CheckCircle2, AlertCircle, Plus, Minus, Layers } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useCartStore } from '@/features/cart/cartStore';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { useHydration } from '@/lib/useHydration';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const hasMounted = useHydration();
  const { addItem } = useCartStore();
  const { isAuthenticated, openLoginModal } = useUserAuthStore();

  const [selectedImage, setSelectedImage] = useState<string>(
    product.main_image_url ||
      'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'
  );
  const [quantity, setQuantity] = useState<number>(1);

  const images = [
    { id: 'main', url: product.main_image_url || 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800' },
    ...(product.product_images?.map((img) => ({ id: img.id, url: img.image_url })) || []),
  ];

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    const maxStock = product.stock > 0 ? product.stock : 999;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (hasMounted && !isAuthenticated()) {
      openLoginModal({ product, quantity });
      return;
    }
    addItem(product, quantity);
  };

  const isAvailable = product.active && product.stock > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* 1. Galería de Imágenes (Izquierda) */}
      <div className="lg:col-span-6 space-y-4">
        {/* Imagen Visor Principal */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-md">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover transition-all duration-300"
            priority
          />
          {product.category && (
            <span className="absolute top-4 left-4 bg-[#0F172A]/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Miniaturas de Galería */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={img.id + idx}
                onClick={() => setSelectedImage(img.url)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                  selectedImage === img.url
                    ? 'border-[#0284C7] ring-2 ring-[#0284C7]/30 scale-105'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Image src={img.url} alt={`Vista ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Información Comercial y Compra (Derecha) */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Categoría y Nombre */}
        <div>
          {product.category && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" /> {product.category.name}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>
        </div>

        {/* Estado de Disponibilidad */}
        <div className="flex items-center gap-2">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Disponible en Inventario ({product.stock} Unidades)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Disponible Bajo Pedido Comercial
            </span>
          )}
        </div>

        {/* Precio Unitario */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Precio Unitario de Cotización
            </span>
            {product.discount && product.discount > 0 ? (
                <div className="flex items-center gap-2">
    <span className="line-through text-sm text-slate-500">{formatCurrency(product.price)}</span>
    <span className="text-3xl font-black text-[#0F172A]">{formatCurrency(product.price * (1 - product.discount / 100))}</span>
    <span className="text-xs font-medium text-[#F97316]">-{product.discount}%</span>
  </div>
            ) : (
  <span className="text-3xl font-black text-[#0F172A]">{formatCurrency(product.price)}</span>
)}
          </div>
          <span className="text-[11px] font-medium text-slate-400">Sin Impuestos Aplicables</span>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Descripción General
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Selector de Cantidad y Agregar al Carrito */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cantidad a Cotizar:
            </span>
            <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-xs">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-l-xl transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold text-slate-900">
                {quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-r-xl transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Agregar al Carrito de Cotización
            </button>
          </div>
        </div>

        {/* Especificaciones / Características Técnicas */}
        {product.product_features && product.product_features.length > 0 && (
          <div className="pt-6 border-t border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Especificaciones Técnicas
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100 text-xs">
              {product.product_features.map((feat) => (
                <div key={feat.id} className="grid grid-cols-2 p-3">
                  <span className="font-bold text-slate-700">{feat.name}</span>
                  <span className="text-slate-600">{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
