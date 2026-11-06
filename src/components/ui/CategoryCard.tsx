'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Category } from '@/types';

// Fallback de imágenes de productos reales por slug de categoría
const FALLBACK_CATEGORY_IMAGES: Record<string, { image: string; name: string }[]> = {
  dotacion: [
    { image: 'https://www.abastece.co/abastece/images/72058.jpg', name: 'Casco Dieléctrico Steelpro' },
    { image: 'https://www.abastece.co/abastece/images/75051.jpg', name: 'Bota de Seguridad Dieléctrica' },
    { image: 'https://www.abastece.co/abastece/images/73772.jpg', name: 'Chaleco Reflectivo Brigadista' },
    { image: 'https://www.abastece.co/abastece/images/75801.jpg', name: 'Botiquín y Analgésicos' },
    { image: 'https://www.abastece.co/abastece/images/76481.jpg', name: 'Alcohol Antiséptico 70%' },
  ],
  ferreteria: [
    { image: 'https://www.abastece.co/abastece/images/75953.jpg', name: 'Juego de Brocas 29 Pzas' },
    { image: 'https://www.abastece.co/abastece/images/1293.jpg', name: 'Aceite 3 En 1 Multiusos' },
    { image: 'https://www.abastece.co/abastece/images/75978.jpg', name: 'Alicate Aislado 1000V' },
    { image: 'https://www.abastece.co/abastece/images/75160.jpg', name: 'Destornillador Tester' },
    { image: 'https://www.abastece.co/abastece/images/77006.jpg', name: 'Cinta Antideslizante' },
  ],
  papeleria: [
    { image: 'https://www.abastece.co/abastece/images/8726.jpg', name: 'Carpeta Oficio con Broche' },
    { image: 'https://www.abastece.co/abastece/images/3191.jpg', name: 'Agenda Permanente Ejecutiva' },
    { image: 'https://www.abastece.co/abastece/images/75560.jpg', name: 'Carpeta 4 Aletas Blanca' },
    { image: 'https://www.abastece.co/abastece/images/9500.jpg', name: 'Acetato Fotocopiadora' },
    { image: 'https://www.abastece.co/abastece/images/74863.jpg', name: 'Alfileres Triton Galvanizados' },
  ],
  aseo: [
    { image: 'https://www.abastece.co/abastece/images/8250.jpg', name: 'Ambientador Bonaire Baby Fresh' },
    { image: 'https://www.abastece.co/abastece/images/1778.jpg', name: 'Suavitel Acondicionador 1000ml' },
    { image: 'https://www.abastece.co/abastece/images/74288.jpg', name: 'Protector de Cuero Binner' },
    { image: 'https://www.abastece.co/abastece/images/8352.jpg', name: 'Ambientador Bonaire Bambú' },
    { image: 'https://www.abastece.co/abastece/images/5371.jpg', name: 'Ambientador Mora Silvestre' },
  ],
};

interface CategoryCardProps {
  category: Category;
  previewImages?: { image: string; name?: string }[];
}

export function CategoryCard({ category, previewImages }: CategoryCardProps) {
  // Obtener la lista de imágenes reales: las pasadas como prop o las del fallback por slug
  const items = React.useMemo(() => {
    if (previewImages && previewImages.length > 0) {
      return previewImages;
    }
    const fallback = FALLBACK_CATEGORY_IMAGES[category.slug];
    if (fallback && fallback.length > 0) {
      return fallback;
    }
    return [
      {
        image: category.image_url || 'https://www.abastece.co/abastece/images/1293.jpg',
        name: category.name,
      },
    ];
  }, [previewImages, category]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Rotación automática cada 2.8 segundos (se pausa suavemente al hacer hover si el usuario desea observar)
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [items.length]);

  const currentItem = items[currentIndex] || items[0];

  return (
    <Link
      href={`/categorias/${category.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative h-88 rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#0F172A] border border-slate-700/60 shadow-lg hover:shadow-2xl hover:border-[#0284C7]/50 transition-all duration-300 flex flex-col justify-between p-6 cursor-pointer"
    >
      {/* Resplandor decorativo de fondo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#0284C7]/15 rounded-full blur-2xl group-hover:bg-[#F97316]/20 transition-all duration-500 pointer-events-none" />

      {/* Cabecera de la Tarjeta */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-xs">
          <Layers className="w-3 h-3 text-[#F97316]" /> Línea Institucional
        </span>

        {/* Indicador de carrusel activo */}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
          <Sparkles className="w-2.5 h-2.5 text-[#F97316]" /> {currentIndex + 1}/{items.length}
        </span>
      </div>

      {/* Imagen en Carrusel con Transición Suave */}
      <div className="relative z-10 my-auto py-2 flex flex-col items-center justify-center">
        <div className="relative w-40 h-40 bg-white rounded-2xl p-3 shadow-xl border border-slate-200/80 group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-500 flex items-center justify-center overflow-hidden">
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={idx}
                className={`absolute inset-0 p-3 flex items-center justify-center transition-all duration-700 ease-in-out ${
                  isActive
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={item.image}
                    alt={item.name || category.name}
                    fill
                    sizes="160px"
                    className="object-contain p-1 mix-blend-multiply transition-transform duration-500"
                    priority={idx === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pequeños Puntos Indicadores (Dots) Interactivos */}
        {items.length > 1 && (
          <div className="flex items-center gap-1.5 mt-3">
            {items.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-[#38BDF8] shadow-xs'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Ver foto ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Información Inferior */}
      <div className="relative z-10 space-y-1.5 pt-2 border-t border-slate-800/80">
        <h3 className="text-xl font-extrabold text-white group-hover:text-[#38BDF8] transition">
          {category.name}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
        <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-[#F97316] transition-colors">
          <span>Explorar Catálogo</span>
          <ArrowRight className="w-4 h-4 text-[#F97316] group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
