import React from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, ArrowRight, Phone, MessageSquare, Download, Building2 } from 'lucide-react';

interface OrderConfirmedPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderConfirmedPage({ params }: OrderConfirmedPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 text-center">
      
      {/* Icono de Éxito */}
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-extrabold text-[#0284C7] bg-[#0284C7]/10 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          ¡Solicitud Registrada Exitosamente!
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Su pedido ha sido recibido
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Gracias por confiar en <strong className="text-slate-900">DOTACIONES & SUMINISTROS</strong>. Un asesor comercial revisará la solicitud y se pondrá en contacto con su organización.
        </p>
      </div>

      {/* Tarjeta del Número de Pedido */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md max-w-lg mx-auto space-y-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Identificador Único de Cotización
        </span>
        <div className="text-3xl font-black text-[#0F172A] tracking-wider font-mono bg-slate-100 py-3 px-6 rounded-2xl border border-slate-300">
          {id}
        </div>
        <p className="text-xs text-slate-500">
          Conserve este número para consultar el estado o realizar seguimiento comercial.
        </p>

        {/* Acciones Rápidas Comercial (WhatsApp / Descarga) */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`https://wa.me/573000000000?text=${encodeURIComponent(`Hola, acabo de realizar la solicitud de cotización número ${id} en su página web.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Notificar por WhatsApp
          </a>
          <button
            onClick={undefined}
            className="py-3 px-4 bg-[#0F172A] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Guardar Resumen
          </button>
        </div>
      </div>

      {/* Siguientes Pasos */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 text-left max-w-lg mx-auto space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
          <Building2 className="w-4 h-4 text-[#F97316]" /> Próximos Pasos en el Proceso:
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-slate-600 leading-relaxed">
          <li>Revisión de existencias e inventario en bodega.</li>
          <li>Emisión de la oferta mercantil o factura de cotización formal.</li>
          <li>Coordinación de despacho y fecha de entrega.</li>
        </ol>
      </div>

      <div className="pt-4">
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0284C7] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-[#0284C7]/90 transition"
        >
          Volver al Catálogo <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
