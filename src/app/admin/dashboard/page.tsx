import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { Package, Layers, ShoppingBag, Plus, Users, UserCheck, ShieldAlert, Building2, Mail, Phone, Calendar } from 'lucide-react';
import { AdminReportExporter } from '@/features/admin/AdminReportExporter';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // Datos siempre en vivo en dashboard admin

interface ProfileItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role: string;
  created_at: string;
}

export default async function AdminDashboardPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  let orders: any[] = [];
  let profiles: ProfileItem[] = [];

  try {
    const supabase = await createClient();

    // 1. Obtener pedidos reales de Supabase
    const { data: dbOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!ordersError && dbOrders) {
      orders = dbOrders;
    }

    // 2. Obtener usuarios/perfiles reales de Supabase
    const { data: dbProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profilesError && dbProfiles) {
      profiles = dbProfiles;
    }
  } catch (err) {
    console.error('Error al consultar datos en AdminDashboardPage:', err);
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.active).length;
  const totalCategories = categories.length;
  const totalOrders = orders.length;
  const totalClients = profiles.length;

  return (
    <div className="space-y-10">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Administrativo Oficial
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervisión integral de métricas, clientes nuevos, compras y generación de informes PDF en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/productos"
            className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Registrar Producto
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Productos</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalProducts}</span>
            <span className="text-[11px] font-medium text-emerald-600 mt-1 inline-block">
              {activeProducts} Activos en catálogo
            </span>
          </div>
          <div className="w-12 h-12 bg-[#0284C7]/10 text-[#0284C7] rounded-xl flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Categorías</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalCategories}</span>
            <span className="text-[11px] font-medium text-slate-500 mt-1 inline-block">
              Líneas comerciales
            </span>
          </div>
          <div className="w-12 h-12 bg-[#F97316]/10 text-[#F97316] rounded-xl flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Clientes Registrados</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalClients}</span>
            <span className="text-[11px] font-medium text-[#0284C7] mt-1 inline-block">
              Perfiles en Supabase
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Pedidos Recibidos</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{totalOrders}</span>
            <span className="text-[11px] font-medium text-amber-600 mt-1 inline-block">
              Cotizaciones en DB
            </span>
          </div>
          <div className="w-12 h-12 bg-[#0F172A]/10 text-[#0F172A] rounded-xl flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECCIÓN: Nuevos Usuarios Registrados */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0284C7]/10 text-[#0284C7] rounded-xl flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Usuarios y Clientes Registrados</h2>
              <p className="text-xs text-slate-500">
                Listado en vivo de cuentas y empresas creadas desde la plataforma (Sincronizado con Supabase Auth & Profiles).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              {profiles.length} registrados
            </span>
            <Link
              href="/admin/usuarios"
              className="px-3 py-1.5 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs rounded-xl transition shadow-2xs"
            >
              Gestionar Usuarios (CRUD)
            </Link>
          </div>
        </div>

        {profiles.length === 0 ? (
          <div className="p-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Sin usuarios registrados por el momento</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Cuando los clientes creen su cuenta en la página de registro o inicien sesión, sus perfiles se vincularán y visualizarán automáticamente aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Usuario / Nombre</th>
                  <th className="p-3.5">Correo Electrónico</th>
                  <th className="p-3.5">Empresa / Razón Social</th>
                  <th className="p-3.5">Teléfono</th>
                  <th className="p-3.5">Rol</th>
                  <th className="p-3.5">Fecha Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5 font-bold text-slate-900">{user.full_name || 'Sin nombre'}</td>
                    <td className="p-3.5 font-mono text-slate-600 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
                        {user.company || 'Particular'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      {user.phone ? (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">No especificado</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      {user.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
                          ADMIN
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-md">
                          CLIENTE
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-500 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(user.created_at).toLocaleDateString('es-CO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Módulo Especial de Exportación PDF e Informes Ejecutivos */}
      <AdminReportExporter orders={orders} clients={profiles} products={products} />
    </div>
  );
}
