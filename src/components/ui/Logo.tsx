'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ variant = 'dark', size = 'md', showSubtitle = true }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-10',
    md: 'h-14',
    lg: 'h-20',
  };

  return (
    <Link href="/" className="inline-flex items-center gap-3 group shrink-0">
      {!imageError ? (
        <div className={`relative ${sizeClasses[size]} aspect-2/1 flex items-center`}>
          <Image
            src="/logo.png"
            alt="DOTACIONES & SUMINISTROS Logo Oficial"
            width={260}
            height={90}
            className="object-contain h-full w-auto drop-shadow-xs group-hover:scale-105 transition-transform"
            onError={() => setImageError(true)}
            priority
          />
        </div>
      ) : (
        /* Fallback SVG de Alta Fidelidad basado en el Logo Oficial de 3 círculos */
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-[-8px]">
            {/* Círculo 1: Ferretería (Engranaje + Casco) - Azul Oscuro & Naranja */}
            <div className="w-9 h-9 rounded-full border-4 border-[#0F172A] bg-white flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#F97316]">
                <path d="M12 2a9 9 0 00-9 9v2h18v-2a9 9 0 00-9-9zm-7 13h14v2H5z" />
              </svg>
            </div>
            {/* Círculo 2: Aseo (Escoba + Gota) - Cian */}
            <div className="w-9 h-9 rounded-full border-4 border-[#0284C7] bg-white flex items-center justify-center shadow-xs z-10">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0284C7]">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
            </div>
            {/* Círculo 3: Dotación (Chaleco + Guante) - Naranja & Azul */}
            <div className="w-9 h-9 rounded-full border-4 border-[#F97316] bg-white flex items-center justify-center shadow-xs">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#0F172A]">
                <path d="M6 2L2 6v14a2 2 0 002 2h16a2 2 0 002-2V6l-4-4H6zm6 4a2 2 0 110 4 2 2 0 010-4z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <span
              className={`text-lg font-black tracking-tight leading-tight font-sans ${
                variant === 'light' ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              DOTACIONES <span className="text-[#F97316]">&</span> SUMINISTROS
            </span>
            {showSubtitle && (
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 uppercase">
                TODO TIPO DE DOTACIÓN • FERRETERÍA • ASEO
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
