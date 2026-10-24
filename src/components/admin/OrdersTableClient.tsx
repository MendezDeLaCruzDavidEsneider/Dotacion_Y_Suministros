'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { updateOrderStatusAction } from '@/features/orders/actions';

export interface OrderItemData {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderData {
  id: string;
  order_number: string;
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  subtotal: number;
  total: number;
  status: string;
  created_at: string;
  items_count: number;
  order_items?: OrderItemData[];
}

interface OrdersTableClientProps {
  initialOrders: OrderData[];
}

export function OrdersTableClient({ initialOrders }: OrdersTableClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      o.order_number.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      o.customer_name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      o.company_name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase().trim());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    setMsg(null);
    try {
      const res = await updateOrderStatusAction(orderId, newStatus);
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setMsg({ text: 'Estado del pedido actualizado correctamente en Supabase.', type: 'success' });
        router.refresh();
      } else {
        setMsg({ text: res.error || 'Error al actualizar el estado.', type: 'error' });
      }
    } catch {
      setMsg({ text: 'Error de conexión con el servidor.', type: 'error' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendiente
          </span>
        );
      case 'EN_REVISION':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-sky-600" /> En Revisión
          </span>
        );
      case 'CONFIRMADO':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Confirmado
          </span>
        );
      case 'EN_PREPARACION':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" /> En Preparación
          </span>
        );
      case 'ENVIADO':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-lg">
            <Truck className="w-3.5 h-3.5 text-purple-600" /> Enviado
          </span>
        );
      case 'COMPLETADO':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completado
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" /> Cancelado
          </span>
        );
      default:
        return <span className="text-xs font-bold text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Mensajes de feedback */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Filtros de estado */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'all'
                ? 'bg-[#0F172A] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('PENDIENTE')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'PENDIENTE'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setStatusFilter('CONFIRMADO')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'CONFIRMADO'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Confirmados
          </button>
          <button
            onClick={() => setStatusFilter('COMPLETADO')}
            className={`px-3 py-1.5 rounded-lg transition ${
              statusFilter === 'COMPLETADO'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completados
          </button>
        </div>

        {/* Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por # pedido, cliente, empresa..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron cotizaciones ni pedidos</h3>
          <p className="text-xs text-slate-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No hay registros que coincidan con los filtros aplicados.'
              : 'Cuando los clientes soliciten cotizaciones en la tienda, aparecerán listados aquí en tiempo real.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 hover:border-slate-300 transition">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-black font-mono bg-[#0F172A] text-white px-3 py-1 rounded-lg">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-slate-400">Recibido: {order.created_at}</span>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Datos del Cliente y Entidad */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold uppercase block">Empresa / Entidad:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                    <Building2 className="w-4 h-4 text-[#0284C7]" /> {order.company_name}
                  </span>
                  {order.address && (
                    <span className="text-slate-500 block truncate">{order.address}</span>
                  )}
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

              {/* Items del pedido */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                  <span className="font-bold text-slate-700 block text-[11px] uppercase">Artículos incluidos:</span>
                  <div className="divide-y divide-slate-200/60">
                    {order.order_items.map((item, idx) => (
                      <div key={item.id || idx} className="py-1 flex justify-between text-slate-600">
                        <span>{item.quantity}x {item.product_name}</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(Number(item.subtotal))}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cambiar Estado en tiempo real */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-500 font-medium">Items en pedido: {order.items_count} Productos</span>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">Actualizar Estado:</span>
                  {updatingId === order.id ? (
                    <div className="flex items-center gap-1.5 text-[#0284C7] font-semibold text-xs px-2 py-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
                    </div>
                  ) : (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden cursor-pointer"
                    >
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="EN_REVISION">EN REVISIÓN</option>
                      <option value="CONFIRMADO">CONFIRMADO</option>
                      <option value="EN_PREPARACION">EN PREPARACIÓN</option>
                      <option value="ENVIADO">ENVIADO</option>
                      <option value="COMPLETADO">COMPLETADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
