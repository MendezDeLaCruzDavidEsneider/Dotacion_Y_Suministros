import React from 'react';
import { getCategories } from '@/services/categories.service';
import { Layers, Plus, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Categorías Comerciales
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administre las líneas de negocio de Dotación, Ferretería, Papelería y Aseo.
          </p>
        </div>
      </div>

      {/* Grilla de Categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0284C7]" />
                <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" /> Activa
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {cat.description}
            </p>

            <div className="pt-2 flex justify-between items-center text-xs font-mono text-slate-400 border-t border-slate-100">
              <span>Slug: /{cat.slug}</span>
              <span>Orden: {cat.sort_order}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
