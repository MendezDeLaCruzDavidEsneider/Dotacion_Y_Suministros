import React from 'react';
import { ShoppingBag, Clock, Building2, User, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;

// Lista mock demostrativa si aún no hay pedidos en DB
const DEMO_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'PED-2026-8492',
    customer_name: 'Ing. Fernando Gómez',
    company_name: 'Construcciones & Vías S.A.S.',
    email: 'compras@construvias.co',
    phone: '+57 315 888 9900',
    subtotal: 540000,
    total: 540000,
    status: 'PENDIENTE',
    created_at: '2026-10-05 14:30',
    items_count: 3,
  },
  {
    id: 'ord-102',
    order_number: 'PED-2026-3104',
    customer_name: 'Dra. María Paula Torres',
    company_name: 'Clínica San Ignacio',
    email: 'suministros@clinicasanignacio.org',
    phone: '+57 300 444 1122',
    subtotal: 1250000,
    total: 1250000,
    status: 'EN_REVISION',
    created_at: '2026-10-05 11:15',
    items_count: 5,
  },
];

export default async function AdminOrdersPage() {
  let orders = DEMO_ORDERS;

  try {
    const supabase = await createClient();
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && dbOrders && dbOrders.length > 0) {
      orders = dbOrders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        company_name: o.company_name,
        email: o.email,
        phone: o.phone,
        subtotal: Number(o.subtotal),
        total: Number(o.total),
        status: o.status,
        created_at: new Date(o.created_at).toLocaleString('es-CO'),
        items_count: o.order_items?.length || 0,
      }));
    }
  } catch {}
  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Pedidos y Cotizaciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise solicitudes recibidas, confirme precios y actualice estados de despacho.
          </p>
        </div>
      </div>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black font-mono bg-[#0F172A] text-white px-3 py-1 rounded-lg">
                  {order.order_number}
                </span>
                <span className="text-xs text-slate-400">Recibido: {order.created_at}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  Estado: {order.status}
                </span>
              </div>
            </div>

            {/* Datos del Cliente y Entidad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase block">Empresa / Entidad:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                  <Building2 className="w-4 h-4 text-[#0284C7]" /> {order.company_name}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase block">Contacto:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" /> {order.customer_name}
                </span>
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> {order.email}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase block">Teléfono / Total:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {order.phone}
                </span>
                <span className="text-sm font-extrabold text-[#0F172A] block">
                  Total Cotizado: {formatCurrency(order.total)}
                </span>
              </div>
            </div>

            {/* Cambiar Estado */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">Items en pedido: {order.items_count} Productos</span>
              
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Cambiar Estado:</span>
                <select
                  defaultValue={order.status}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="EN_REVISION">EN REVISIÓN</option>
                  <option value="CONFIRMADO">CONFIRMADO</option>
                  <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                  <option value="ENVIADO">ENVIADO</option>
                  <option value="COMPLETADO">COMPLETADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
