'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Star,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  ImageIcon,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { deleteProductAction } from '@/features/products/adminActions';

interface ProductTableClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductTableClient({ initialProducts, categories }: ProductTableClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.category_id === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      prod.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (prod.category?.name && prod.category.name.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    return matchesCategory && matchesSearch;
  });

  const handleDelete = async (productId: string, productName: string) => {
    const confirmDelete = window.confirm(
      `¿Está seguro de que desea eliminar el producto "${productName}" de la base de datos? Esta acción no se puede deshacer.`
    );
    if (!confirmDelete) return;

    setDeletingId(productId);
    setErrorMsg(null);

    try {
      const res = await deleteProductAction(productId);
      if (!res.success) {
        setErrorMsg(res.error || 'No fue posible eliminar el producto.');
        setDeletingId(null);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con la base de datos.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado con Botón de Creación */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión Integral de Productos
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cree, edite y elimine productos en cada categoría en tiempo real con Supabase.
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="px-4 py-2.5 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Registrar Nuevo Producto
        </Link>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Barra de Filtros: Búsqueda y Pestañas por Categoría */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Selector de Categorías */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({products.length})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#0F172A] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio COP</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Destacado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center text-slate-400">
                    No se encontraron productos en esta categoría o filtro.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 w-14">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.main_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.main_image_url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs">
                      <span className="block truncate">{prod.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">/{prod.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                        {prod.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-[#0F172A]">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="p-4">
                      <span className={`font-bold ${prod.stock > 0 ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {prod.stock} Uds
                      </span>
                    </td>
                    <td className="p-4">
                      {prod.active ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          <XCircle className="w-3 h-3" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {prod.featured ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md text-[11px]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Sí
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/productos/${prod.id}`}
                          className="p-2 text-slate-600 hover:text-[#0284C7] hover:bg-slate-100 rounded-lg transition inline-flex items-center gap-1 font-bold text-xs"
                          title="Editar producto"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Editar
                        </Link>
                        <button
                          type="button"
                          disabled={deletingId === prod.id}
                          onClick={() => handleDelete(prod.id, prod.name)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition inline-flex items-center gap-1 font-bold text-xs disabled:opacity-50 cursor-pointer"
                          title="Eliminar producto"
                        >
                          {deletingId === prod.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
