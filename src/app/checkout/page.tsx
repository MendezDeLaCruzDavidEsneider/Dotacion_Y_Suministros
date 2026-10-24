'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/cartStore';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { formatCurrency } from '@/lib/utils';
import { useHydration } from '@/lib/useHydration';
import { createOrderAction } from '@/features/orders/actions';
import { ShieldCheck, ArrowLeft, Send, Building2, User, Mail, Phone, MapPin, FileText, AlertCircle, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const hasMounted = useHydration();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useUserAuthStore();
  const subtotal = hasMounted ? getSubtotal() : 0;
  const cartItems = hasMounted ? items : [];

  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    company_name: user?.company || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    notes: '',
  });

  // Efecto para sincronizar datos del usuario cuando se monte o cambie
  React.useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || '',
        company_name: prev.company_name || user.company || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-800">No hay productos en su carrito para cotizar</h1>
        <Link
          href="/productos"
          className="inline-block px-4 py-2 bg-[#0284C7] text-white text-xs font-bold rounded-xl"
        >
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await createOrderAction({
        ...formData,
        items: cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Ocurrió un error al procesar el pedido.');
        setLoading(false);
        return;
      }

      // Vaciar carrito tras confirmación exitosa
      clearCart();
      router.push(`/pedido-confirmado/${result.orderNumber}?id=${result.orderId}`);
    } catch {
      setErrorMsg('No fue posible conectar con el servidor. Intente de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Volver */}
      <Link href="/carrito" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0284C7] transition">
        <ArrowLeft className="w-3.5 h-3.5" /> Volver al Carrito
      </Link>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Confirmación de Pedido / Cotización Formal
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete los datos institucionales de su empresa para generar la solicitud de suministro.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulario (Izquierda) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-[#0284C7]" />
            <h2 className="text-base font-bold text-slate-900">Datos de la Empresa y Contacto</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo del Solicitante *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Ej. Ing. Carlos Mendoza"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Empresa o Entidad Solicitante *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Ej. Constructora del Norte S.A.S."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico Corporativo *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="compras@empresa.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono o Celular de Contacto *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+57 300 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dirección de Entrega / Sede (Opcional)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle 100 # 15-20, Edificio Corporativo, Ciudad"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observaciones o Especificaciones Especiales (Opcional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Indique si requiere tallaje específico, condiciones de entrega especiales o requerimientos de facturación electrónica."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Validando y procesando pedido...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Confirmar y Enviar Pedido
                </>
              )}
            </button>
          </form>
        </div>

        {/* Resumen del Pedido (Derecha) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Detalle de Productos ({cartItems.length})
            </h2>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const hasDiscount = item.product.discount && item.product.discount > 0;
                const unitPrice = hasDiscount
                  ? item.product.price * (1 - item.product.discount! / 100)
                  : item.product.price;
                return (
                  <div key={item.product.id} className="py-3 flex justify-between items-center text-xs">
                    <div className="min-w-0 flex-1 pr-2">
                      <span className="font-bold text-slate-900 block truncate">{item.product.name}</span>
                      <div className="text-slate-500 flex items-center gap-1.5">
                        <span>{item.quantity} x {formatCurrency(unitPrice)}</span>
                        {hasDiscount && (
                          <span className="text-[10px] text-[#F97316] font-bold bg-orange-50 px-1 rounded">
                            -{item.product.discount}%
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-extrabold text-[#0F172A] shrink-0">
                      {formatCurrency(unitPrice * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-[#0F172A] pt-2 border-t border-slate-200">
                <span>Total Estimado:</span>
                <span className="text-[#0284C7]">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No se realizará cobro bancario inmediato. Recibirá su confirmación oficial.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
