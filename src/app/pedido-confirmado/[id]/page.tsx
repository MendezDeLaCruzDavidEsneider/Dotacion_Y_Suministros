import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, MessageSquare, Building2, Clock, ShieldCheck } from 'lucide-react';

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
          Gracias por confiar en <strong className="text-slate-900">DOTACIONES & SUMINISTROS</strong>. Un asesor comercial revisará la solicitud y coordinará la atención formal.
        </p>
      </div>

      {/* Tarjeta del Número de Pedido y Acción Única de WhatsApp */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md max-w-lg mx-auto space-y-5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Identificador Único de Cotización
        </span>
        <div className="text-3xl font-black text-[#0F172A] tracking-wider font-mono bg-slate-100 py-3 px-6 rounded-2xl border border-slate-300">
          {id}
        </div>
        <p className="text-xs text-slate-500">
          Conserve este número para consultar el estado o realizar seguimiento comercial.
        </p>

        {/* Notificación para Agilidad y Mayor Eficiencia */}
        <div className="pt-4 border-t border-slate-100 space-y-3 text-left">
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Para mayor eficiencia y agilidad en el despacho de su pedido</strong>, por favor notifique a nuestro asesor comercial directamente al WhatsApp con su número de solicitud.
            </p>
          </div>

          {/* Botón Exclusivo de WhatsApp */}
          <a
            href={`https://wa.me/573208438654?text=${encodeURIComponent(
              `Hola, acabo de registrar la solicitud de pedido número ${id} en su página web y deseo confirmar la atención y despacho.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Notificar al WhatsApp</span>
          </a>
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

      <div className="pt-2">
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
