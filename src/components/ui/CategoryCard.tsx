import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers } from 'lucide-react';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categorias/${category.slug}`}
      className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 border border-slate-200/50"
    >
      {/* Imagen de Fondo */}
      <Image
        src={
          category.image_url ||
          'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'
        }
        alt={category.name}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* Degradado Oscuro */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent group-hover:from-[#0F172A]/90 transition-colors" />

      {/* Contenido */}
      <div className="relative z-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0284C7]/80 text-white text-[11px] font-semibold backdrop-blur-xs">
          <Layers className="w-3 h-3" /> Categoría Comercial
        </div>
        <h3 className="text-2xl font-extrabold text-white group-hover:text-[#F97316] transition">
          {category.name}
        </h3>
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        <div className="pt-2 flex items-center gap-2 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
          Explorar Categoría <ArrowRight className="w-4 h-4 text-[#F97316]" />
        </div>
      </div>
    </Link>
  );
}
