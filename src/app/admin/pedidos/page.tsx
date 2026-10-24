import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { OrdersTableClient, OrderData } from '@/components/admin/OrdersTableClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  let orders: OrderData[] = [];

  try {
    const supabase = await createClient();
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && dbOrders) {
      orders = dbOrders.map((o) => ({
        id: o.id,
        order_number: o.order_number,
        customer_name: o.customer_name,
        company_name: o.company_name,
        email: o.email,
        phone: o.phone,
        address: o.address,
        notes: o.notes,
        subtotal: Number(o.subtotal || 0),
        total: Number(o.total || 0),
        status: o.status,
        created_at: new Date(o.created_at).toLocaleString('es-CO', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items_count: o.order_items?.length || 0,
        order_items: (o.order_items || []).map((item: any) => ({
          id: item.id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: Number(item.unit_price),
          subtotal: Number(item.subtotal),
        })),
      }));
    }
  } catch (err) {
    console.error('Error al cargar pedidos en admin:', err);
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Pedidos y Cotizaciones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise solicitudes recibidas en tiempo real, confirme cotizaciones y actualice estados de despacho en Supabase.
          </p>
        </div>
      </div>

      {/* Componente interactivo cliente */}
      <OrdersTableClient initialOrders={orders} />
    </div>
  );
}
