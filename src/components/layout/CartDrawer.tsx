'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { formatCurrency } from '@/lib/utils';
import { useHydration } from '@/lib/useHydration';

export function CartDrawer() {
  const hasMounted = useHydration();
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { user, openLoginModal } = useUserAuthStore();
  const subtotal = getSubtotal();

  if (!hasMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Oscuro */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header del Carrito */}
          <div className="p-4 sm:p-6 bg-[#0F172A] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0284C7]" />
              <h2 className="text-lg font-bold">Carrito de Cotización</h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800">El carrito está vacío</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Explora nuestro catálogo para agregar productos a tu solicitud de cotización.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="mt-4 px-4 py-2 bg-[#0284C7] text-white text-xs font-semibold rounded-lg hover:bg-[#0284C7]/90 transition"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-center">
                  {/* Imagen */}
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={item.product.main_image_url || 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=200'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </h4>
                    {item.product.discount && item.product.discount > 0 ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="line-through text-[10px] text-slate-400">
                          {formatCurrency(item.product.price)}
                        </span>
                        <span className="text-xs font-bold text-[#0284C7]">
                          {formatCurrency(item.product.price * (1 - item.product.discount / 100))}
                        </span>
                        <span className="text-[10px] text-[#F97316] font-bold bg-orange-50 px-1 rounded">
                          -{item.product.discount}%
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs font-semibold text-[#0284C7] mt-0.5">
                        {formatCurrency(item.product.price)}
                      </p>
                    )}

                    {/* Selector de cantidad */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-l-md transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 text-slate-600 rounded-r-md transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-slate-400 hover:text-red-500 p-1 transition"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal del item */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {formatCurrency(
                        (item.product.discount && item.product.discount > 0
                          ? item.product.price * (1 - item.product.discount / 100)
                          : item.product.price) * item.quantity
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer del Carrito con Subtotal y Acciones */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Subtotal Estimado:</span>
                <span className="text-lg text-[#0F172A]">{formatCurrency(subtotal)}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Los precios y disponibilidades serán confirmados en el documento de cotización.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/carrito"
                  onClick={closeCart}
                  className="w-full text-center py-2.5 px-3 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-100 transition flex items-center justify-center gap-1"
                >
                  Ver Carrito
                </Link>
                <button
                  onClick={() => {
                    closeCart();
                    if (!user) {
                      // Sin sesión: abrir modal de login
                      openLoginModal();
                    } else {
                      window.location.href = '/checkout';
                    }
                  }}
                  className="w-full text-center py-2.5 px-3 bg-[#F97316] text-white font-bold text-xs rounded-lg hover:bg-[#F97316]/90 transition shadow-sm flex items-center justify-center gap-1"
                >
                  Cotizar Ahora <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
