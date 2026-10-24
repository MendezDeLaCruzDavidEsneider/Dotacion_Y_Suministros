'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserAuthStore } from '@/features/auth/userAuthStore';
import { useHydration } from '@/lib/useHydration';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Building2,
  Phone,
  Mail,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface ServiceOrder {
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
  status: 'PENDIENTE' | 'EN_REVISION' | 'CONFIRMADO' | 'EN_PREPARACION' | 'ENVIADO' | 'COMPLETADO' | 'CANCELADO';
  created_at: string;
  order_items?: OrderItem[];
}

export default function HistorialServiciosPage() {
  const hasMounted = useHydration();
  const { user, openLoginModal } = useUserAuthStore();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!hasMounted) return;
    if (!user?.email) {
      setLoading(false);
      return;
    }

    async function fetchUserOrders() {
      setLoading(true);
      try {
        const supabase = createClient();
        const userEmail = (user?.email || '').toLowerCase().trim();
        if (!userEmail) return;

        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .ilike('email', userEmail)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setOrders(data as ServiceOrder[]);
        } else {
          // Si no tiene pedidos registrados con este correo, verificar si existen pedidos de demostración o dejar vacío
          setOrders([]);
        }
      } catch (err) {
        console.warn('[HistorialServicios] Error cargando órdenes:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserOrders();
  }, [hasMounted, user?.email]);

  if (!hasMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="animate-pulse space-y-4 max-w-md mx-auto">
          <div className="h-8 bg-slate-200 rounded-xl w-3/4 mx-auto" />
          <div className="h-4 bg-slate-100 rounded-lg w-1/2 mx-auto" />
        </div>
      </div>
    );
  }

  // Si no ha iniciado sesión
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#0284C7]/10 text-[#0284C7] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <ClipboardList className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Historial de Servicios y Cotizaciones
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Inicie sesión con su cuenta corporativa para consultar el estado en tiempo real de sus pedidos, cotizaciones activas y despachos programados.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => openLoginModal()}
            className="px-6 py-3.5 bg-[#0F172A] hover:bg-[#0284C7] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" /> Iniciar Sesión de Cliente
          </button>
          <Link
            href="/productos"
            className="px-6 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            Explorar Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      order.company_name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      order.order_items?.some((i) => i.product_name.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ServiceOrder['status']) => {
    switch (status) {
      case 'PENDIENTE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pendiente de Revisión
          </span>
        );
      case 'EN_REVISION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <Clock className="w-3.5 h-3.5" /> En Revisión Comercial
          </span>
        );
      case 'CONFIRMADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Cotización Confirmada
          </span>
        );
      case 'EN_PREPARACION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShoppingBag className="w-3.5 h-3.5" /> En Alistamiento Bodega
          </span>
        );
      case 'ENVIADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Truck className="w-3.5 h-3.5" /> En Despacho / Ruta
          </span>
        );
      case 'COMPLETADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Servicio Entregado
          </span>
        );
      case 'CANCELADO':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5" /> Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const totalSpent = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
  const activeOrdersCount = orders.filter((o) => !['COMPLETADO', 'CANCELADO'].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === 'COMPLETADO').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link href="/" className="hover:text-[#0284C7]">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-bold">Historial de Servicios</span>
      </nav>

      {/* Encabezado y Perfil */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#F97316] text-xs font-extrabold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Centro de Servicios al Cliente
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bienvenido, {user.name}
          </h1>
          <p className="text-xs text-slate-300 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>{user.company || 'Empresa Vinculada'}</span>
            <span className="text-slate-500">|</span>
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>{user.email}</span>
          </p>
        </div>

        <Link
          href="/productos"
          className="px-5 py-3 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
        >
          <ShoppingBag className="w-4 h-4" /> Solicitar Nueva Cotización
        </Link>
      </div>

      {/* Tarjetas de Métricas del Usuario */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Solicitudes</span>
            <span className="text-2xl font-black text-[#0F172A] mt-1 block">{orders.length}</span>
            <span className="text-[11px] text-slate-500">Pedidos registrados en su cuenta</span>
          </div>
          <div className="w-12 h-12 bg-slate-100 text-[#0F172A] rounded-xl flex items-center justify-center font-bold">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">En Seguimiento Activo</span>
            <span className="text-2xl font-black text-[#F97316] mt-1 block">{activeOrdersCount}</span>
            <span className="text-[11px] text-slate-500">Cotizaciones o envíos en curso</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 text-[#F97316] rounded-xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Monto Total Cotizado</span>
            <span className="text-2xl font-black text-[#0284C7] mt-1 block">{formatCurrency(totalSpent)}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">{completedCount} entregas finalizadas</span>
          </div>
          <div className="w-12 h-12 bg-sky-50 text-[#0284C7] rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Pestañas de estado */}
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
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por # pedido o producto..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Lista Detallada de Órdenes */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
          Cargando historial de servicios desde Supabase...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800">
            {searchTerm || statusFilter !== 'all'
              ? 'No hay pedidos que coincidan con los filtros aplicados'
              : 'Aún no tiene solicitudes de servicio registradas'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore el catálogo de dotaciones, ferretería, papelería y aseo para armar su primer pedido.
          </p>
          <Link
            href="/productos"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Ir al Catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition space-y-6"
            >
              {/* Header de la orden */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-base font-black font-mono bg-[#0F172A] text-white px-3.5 py-1.5 rounded-xl tracking-wider">
                    {order.order_number}
                  </span>
                  <div className="text-xs text-slate-500">
                    <span>Fecha: </span>
                    <strong className="text-slate-800">
                      {new Date(order.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </strong>
                  </div>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Grid con datos de envío y contacto */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Empresa / Sede:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#0284C7]" /> {order.company_name}
                  </span>
                  {order.address && (
                    <span className="text-slate-500 block truncate">{order.address}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Contacto Comercial:</span>
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" /> {order.customer_name}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {order.phone}
                  </span>
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-slate-400 font-bold uppercase block text-[10px]">Total Cotización:</span>
                  <span className="text-lg font-black text-[#0F172A] block">
                    {formatCurrency(Number(order.total))}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    {order.order_items?.length || 0} Productos incluidos
                  </span>
                </div>
              </div>

              {/* Detalle de productos */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Productos Solicitados:
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {order.order_items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="p-3 flex justify-between items-center text-xs hover:bg-slate-50 transition"
                      >
                        <div className="min-w-0 flex-1 pr-4">
                          <span className="font-bold text-slate-900 block truncate">{item.product_name}</span>
                          <span className="text-slate-500 text-[11px]">
                            Cantidad: {item.quantity} x {formatCurrency(Number(item.unit_price))}
                          </span>
                        </div>
                        <span className="font-bold text-[#0F172A] shrink-0">
                          {formatCurrency(Number(item.subtotal))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas del pedido */}
              {order.notes && (
                <div className="text-xs bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl text-amber-900">
                  <strong className="block font-bold mb-0.5">Observaciones:</strong>
                  <span>{order.notes}</span>
                </div>
              )}

              {/* Botones de acción rápida */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
                <span className="text-[11px] text-slate-400 font-medium">
                  Atención comercial directa para esta cotización
                </span>

                <div>
                  <a
                    href={`https://wa.me/573000000000?text=${encodeURIComponent(
                      `Hola, quisiera hacer seguimiento a mi cotización ${order.order_number} de la empresa ${order.company_name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp Asesor
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
