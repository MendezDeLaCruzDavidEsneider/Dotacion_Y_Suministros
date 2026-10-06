'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/features/cart/cartStore';
import { formatCurrency } from '@/lib/utils';
import { useHydration } from '@/lib/useHydration';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const hasMounted = useHydration();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const subtotal = hasMounted ? getSubtotal() : 0;
  const cartItems = hasMounted ? items : [];

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Su Carrito de Cotización está Vacío</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Aún no ha seleccionado productos. Explore nuestro catálogo para agregar uniformes, herramientas, papel o insumos de aseo.
          </p>
        </div>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#0284C7] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#0284C7]/90 transition"
        >
          Explorar Catálogo de Productos <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Carrito de Cotización / Pedido
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Revise los productos seleccionados y ajuste las cantidades antes de generar su solicitud.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
        >
          <Trash2 className="w-3.5 h-3.5" /> Vaciar Carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tabla de Items */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Info del Producto */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <Image
                      src={item.product.main_image_url || 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=200'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    {item.product.category && (
                      <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider block">
                        {item.product.category.name}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      <Link href={`/productos/${item.product.slug}`} className="hover:text-[#0284C7]">
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      Precio Unitario: {formatCurrency(item.product.price)}
                    </p>
                  </div>
                </div>

                {/* Controles de Cantidad y Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-l-xl transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-700 rounded-r-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">Subtotal</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-slate-400 hover:text-red-600 p-1.5 transition"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
            <Link href="/productos" className="font-bold text-[#0F172A] hover:text-[#0284C7] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Continuar Comprando
            </Link>
            <span className="text-slate-500 font-medium">Total Items: {cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
          </div>
        </div>

        {/* Resumen del Pedido (Derecha) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Resumen de Cotización
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Productos</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Costo de Envío / Despacho</span>
                <span className="font-semibold text-emerald-600">A Convenir en Cotización</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between text-sm font-extrabold text-[#0F172A]">
                <span>Total Estimado</span>
                <span className="text-lg text-[#0284C7]">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="bg-[#0F172A] text-slate-300 p-4 rounded-xl text-[11px] space-y-2 border border-slate-800">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <ShieldCheck className="w-4 h-4 text-[#F97316]" /> Proceso de Pedido Seguro
              </div>
              <p>
                Al continuar completará sus datos institucionales. Se generará un código correlativo oficial y no se realizarán cargos automáticos a tarjetas.
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              Proceder a Realizar Pedido <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
