'use client';

import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
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

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);

  // Filtrado de productos
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesCategory =
        selectedCategory === 'all' || prod.category_id === selectedCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        prod.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        prod.slug.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (prod.category?.name && prod.category.name.toLowerCase().includes(searchTerm.toLowerCase().trim()));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handlers que reinician la página a 1
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Algoritmo de paginación compacta con elipsis
  const paginationRange = useMemo(() => {
    const delta = 1;
    const range: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    const left = currentPage - delta;
    const right = currentPage + delta;
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (typeof i === 'number' && i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (typeof i === 'number' && i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      if (typeof i === 'number') l = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

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
            Administre, edite y filtre su catálogo de {products.length.toLocaleString('es-CO')} productos en tiempo real con Supabase.
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

      {/* Barra de Filtros: Pestañas por Categoría y Buscador */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        {/* Selector de Categorías */}
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({products.length.toLocaleString('es-CO')})
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count.toLocaleString('es-CO')}
                </span>
              </button>
            );
          })}
        </div>

        {/* Buscador */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nombre o referencia..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Tabla de Productos con Paginación */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[#0F172A] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio COP</th>
                <th className="p-4">Descuento</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Destacado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-slate-400">
                    No se encontraron productos en esta categoría o filtro.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 w-14">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {prod.main_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={prod.main_image_url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs">
                      <span className="block truncate" title={prod.name}>{prod.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">/{prod.slug}</span>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold text-[11px]">
                        {prod.category?.name || 'General'}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-[#0F172A]">
                      {prod.discount && prod.discount > 0 ? (
                        <div>
                          <span className="line-through text-[11px] text-slate-400 block font-normal">
                            {formatCurrency(prod.price)}
                          </span>
                          <span className="text-[#0284C7]">
                            {formatCurrency(prod.price * (1 - prod.discount / 100))}
                          </span>
                        </div>
                      ) : (
                        formatCurrency(prod.price)
                      )}
                    </td>
                    <td className="p-4">
                      {prod.discount && prod.discount > 0 ? (
                        <span className="inline-flex items-center gap-1 bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded-md text-[11px]">
                          -{prod.discount}%
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">0%</span>
                      )}
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

        {/* Barra de Paginación en Panel Admin */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Indicador de Rango y Selector de Items por página */}
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>
                Mostrando <strong className="text-slate-900 font-bold">{(startIndex + 1).toLocaleString('es-CO')} - {endIndex.toLocaleString('es-CO')}</strong> de{' '}
                <strong className="text-slate-900 font-bold">{filteredProducts.length.toLocaleString('es-CO')}</strong> productos
              </span>

              <div className="flex items-center gap-1 pl-3 border-l border-slate-200">
                <span className="text-[11px] text-slate-400">Filas:</span>
                {[15, 30, 50, 100].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setItemsPerPage(size);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                      itemsPerPage === size
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Controles de Navegación Compactos con Elipsis */}
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Anterior
              </button>

              <div className="flex items-center gap-1">
                {paginationRange.map((pageItem, idx) => {
                  if (pageItem === '...') {
                    return (
                      <span
                        key={`dots-${idx}`}
                        className="w-7 h-8 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
                      >
                        •••
                      </span>
                    );
                  }

                  const pageNum = pageItem as number;
                  const isCurrent = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-8 h-8 px-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer"
              >
                Siguiente <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
