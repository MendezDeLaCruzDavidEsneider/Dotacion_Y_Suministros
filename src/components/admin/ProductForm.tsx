'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Category, Product } from '@/types';
import { createProductAction, updateProductAction } from '@/features/products/adminActions';

interface ProductFormProps {
  categories: Category[];
  initialData?: Product | null;
  isEdit?: boolean;
}

export function ProductForm({ categories, initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category_id: initialData?.category_id || (categories[0]?.id || ''),
    price: initialData?.price !== undefined ? initialData.price : 50000,
    discount: initialData?.discount !== undefined ? initialData.discount : 0,
    stock: initialData?.stock !== undefined ? initialData.stock : 20,
    description: initialData?.description || '',
    main_image_url: initialData?.main_image_url || '',
    active: initialData?.active !== undefined ? initialData.active : true,
    featured: initialData?.featured !== undefined ? initialData.featured : false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isEdit && initialData?.id) {
        const res = await updateProductAction(initialData.id, formData);
        if (!res.success) {
          setErrorMsg(res.error || 'Error al actualizar el producto.');
          setLoading(false);
          return;
        }
        setSuccessMsg('¡Producto actualizado exitosamente en la base de datos!');
      } else {
        const res = await createProductAction(formData);
        if (!res.success) {
          setErrorMsg(res.error || 'Error al guardar el producto.');
          setLoading(false);
          return;
        }
        setSuccessMsg('¡Producto creado exitosamente en la base de datos!');
      }

      setTimeout(() => {
        router.push('/admin/productos');
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error de conexión con el servidor.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0284C7] transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Productos
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isEdit ? 'Editar Producto del Catálogo' : 'Registrar Nuevo Producto'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isEdit
              ? 'Modifique la información, precio o existencias en la base de datos.'
              : 'Complete el formulario para publicar un nuevo artículo en la tienda.'}
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Principal (Datos del Producto) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Nombre Comercial del Producto *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej. Botas Dieléctricas Tipo Ingeniero 18KV"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Categoría *
              </label>
              <select
                required
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Precio (COP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-[#0F172A] focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
              />
            </div>
            {/* Descuento en % */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 mt-2">
                Descuento (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Stock / Existencias *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Descripción Detallada y Ficha Técnica
            </label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Indique materiales, normativas vigentes, presentaciones, tallajes y especificaciones para empresas..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              URL de la Imagen Principal
            </label>
            <input
              type="url"
              value={formData.main_image_url}
              onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
              placeholder="https://images.unsplash.com/... o enlace de la imagen"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#0284C7] focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Puede usar cualquier enlace de imagen web o de su servidor de almacenamiento.
            </span>
          </div>
        </div>

        {/* Columna Lateral (Vista previa y Visibilidad) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Vista Previa de Imagen */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#0284C7]" /> Vista Previa
            </h3>
            <div className="w-full aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
              {formData.main_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={formData.main_image_url}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="text-center p-4 text-slate-400 text-xs">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>Sin imagen configurada</span>
                </div>
              )}
            </div>
          </div>

          {/* Opciones de Visibilidad */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider">
              Estado de Publicación
            </h3>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 accent-[#0284C7] rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block">Producto Activo</span>
                <span className="text-[11px] text-slate-500">Visible para cotizar en el catálogo</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-[#F97316] rounded"
              />
              <div>
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  Destacado <Sparkles className="w-3 h-3 text-[#F97316]" />
                </span>
                <span className="text-[11px] text-slate-500">Aparece en la página de inicio</span>
              </div>
            </label>
          </div>

          {/* Botón de Guardado */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-[#0284C7] hover:bg-[#0284C7]/90 text-white font-extrabold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Guardando en Supabase...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
