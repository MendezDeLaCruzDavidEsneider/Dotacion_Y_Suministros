'use client';

import React, { useState } from 'react';
import { Download, Users, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

export function AdminReportExporter() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const reportData = {
    generatedAt: new Date().toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    period: 'Octubre 2026',
    totalRevenue: 4890000,
    totalOrders: 18,
    newClientsCount: 14,
    categoriesPerformance: [
      { name: 'Dotación Laboral', ordersCount: 7, totalCOP: 2150000, percentage: 44 },
      { name: 'Ferretería Industrial', ordersCount: 5, totalCOP: 1420000, percentage: 29 },
      { name: 'Papelería Corporativa', ordersCount: 4, totalCOP: 840000, percentage: 17 },
      { name: 'Aseo y Desinfección', ordersCount: 2, totalCOP: 480000, percentage: 10 },
    ],
    recentClients: [
      { name: 'Ing. Fernando Gómez', email: 'compras@construvias.co', company: 'Construcciones & Vías', date: '2026-10-05', total: '$ 540.000 COP' },
      { name: 'Dra. María Paula Torres', email: 'suministros@clinicasanignacio.org', company: 'Clínica San Ignacio', date: '2026-10-04', total: '$ 1.890.000 COP' },
      { name: 'Carlos Mario Ruiz', email: 'cruiz@distribuciones.com', company: 'Distribuciones del Valle', date: '2026-10-03', total: '$ 1.210.000 COP' },
      { name: 'Lic. Martha Restrepo', email: 'mrestrepo@colegiobolivar.edu.co', company: 'Gimnasio del Norte', date: '2026-10-02', total: '$ 1.250.000 COP' },
    ],
    topProducts: [
      { name: 'Botas de Seguridad Dielectricas', category: 'Dotación', sales: 42, total: '$ 7.770.000 COP' },
      { name: 'Juego de Herramientas Profi 50 Pzas', category: 'Ferretería', sales: 18, total: '$ 5.760.000 COP' },
      { name: 'Caja Resmas Papel Carta 75g', category: 'Papelería', sales: 65, total: '$ 8.125.000 COP' },
      { name: 'Detergente Desinfectante Amonio 5L', category: 'Aseo', sales: 34, total: '$ 1.632.000 COP' },
    ],
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      const { default: jsPDF } = await import('jspdf');
      const autoTableModule = await import('jspdf-autotable');
      const autoTable = autoTableModule.default || autoTableModule;

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // 1. Barra superior decorativa
      doc.setFillColor(15, 23, 42); // #0F172A
      doc.rect(0, 0, pageWidth, 5, 'F');

      // Título de la empresa
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('DOTACIONES & SUMINISTROS', 14, 18);

      // Subtítulo
      doc.setTextColor(249, 115, 22); // #F97316
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TODO TIPO DE DOTACION  |  FERRETERIA  |  PAPELERIA  |  ASEO', 14, 23);

      // Metadatos a la derecha
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORME EJECUTIVO DE VENTAS', pageWidth - 14, 16, { align: 'right' });

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Periodo: ${reportData.period}`, pageWidth - 14, 21, { align: 'right' });
      doc.text(`Generado: ${reportData.generatedAt}`, pageWidth - 14, 25, { align: 'right' });

      // Línea divisoria
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 29, pageWidth - 14, 29);

      // 2. Tarjetas de Métricas Resumen
      const cardWidth = (pageWidth - 28 - 8) / 3;
      const cardY = 34;
      const cardHeight = 22;

      // Tarjeta 1: Total Ventas
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL VENTAS COTIZADAS', 18, cardY + 6);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.text(formatCurrency(reportData.totalRevenue), 18, cardY + 13);
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(7);
      doc.text('+18.4% vs mes anterior', 18, cardY + 18);

      // Tarjeta 2: Clientes Nuevos
      const card2X = 14 + cardWidth + 4;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(card2X, cardY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('CLIENTES NUEVOS REGISTRADOS', card2X + 4, cardY + 6);
      doc.setTextColor(2, 132, 199);
      doc.setFontSize(12);
      doc.text(`${reportData.newClientsCount} Empresas`, card2X + 4, cardY + 13);
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text('Clientes verificados en web', card2X + 4, cardY + 18);

      // Tarjeta 3: Pedidos
      const card3X = card2X + cardWidth + 4;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(card3X, cardY, cardWidth, cardHeight, 2, 2, 'FD');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text('TOTAL PEDIDOS RECIBIDOS', card3X + 4, cardY + 6);
      doc.setTextColor(249, 115, 22);
      doc.setFontSize(12);
      doc.text(`${reportData.totalOrders} Pedidos`, card3X + 4, cardY + 13);
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text('100% procesados en web', card3X + 4, cardY + 18);

      // 3. Tabla 1: Clientes Nuevos y Compras
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. Listado de Clientes Nuevos y Compras', 14, 64);

      // @ts-ignore
      autoTable(doc, {
        startY: 68,
        head: [['Cliente Solicitante', 'Correo Electronico', 'Empresa / Entidad', 'Fecha', 'Monto Cotizado']],
        body: reportData.recentClients.map((client) => [
          client.name,
          client.email,
          client.company,
          client.date,
          client.total,
        ]),
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [51, 65, 85],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [15, 23, 42] },
          4: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
        },
        margin: { left: 14, right: 14 },
      });

      // @ts-ignore
      const finalY1 = doc.lastAutoTable?.finalY || 125;

      // 4. Tabla 2: Rendimiento por Línea de Negocio
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('2. Rendimiento por Linea de Negocio', 14, finalY1 + 10);

      // @ts-ignore
      autoTable(doc, {
        startY: finalY1 + 14,
        head: [['Linea de Negocio', 'Solicitudes Recibidas', 'Total Facturado / Cotizado', 'Participacion']],
        body: reportData.categoriesPerformance.map((cat) => [
          cat.name,
          `${cat.ordersCount} Solicitudes`,
          formatCurrency(cat.totalCOP),
          `${cat.percentage}% del total`,
        ]),
        headStyles: {
          fillColor: [2, 132, 199],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [51, 65, 85],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: [15, 23, 42] },
          2: { halign: 'right', fontStyle: 'bold', textColor: [15, 23, 42] },
          3: { halign: 'center', textColor: [2, 132, 199], fontStyle: 'bold' },
        },
        margin: { left: 14, right: 14 },
      });

      // 5. Pie de Página
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.text(
        'DOTACIONES & SUMINISTROS - Documento Confidencial Interno * Exportado en formato digital PDF',
        14,
        pageHeight - 9
      );
      doc.text(
        `Emitido: ${reportData.generatedAt}`,
        pageWidth - 14,
        pageHeight - 9,
        { align: 'right' }
      );

      // Descargar archivo
      doc.save(`Reporte_Ejecutivo_Dotaciones_y_Suministros_${new Date().toISOString().slice(0, 10)}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      alert('Ocurrió un error al generar el archivo PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Botón de Acción Principal */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E40AF] p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#F97316] uppercase tracking-wider block">
            Módulo de Inteligencia Comercial
          </span>
          <h2 className="text-2xl font-black tracking-tight">Reporte Consolidado de Negocio</h2>
          <p className="text-xs text-slate-300 mt-1">
            Descargue el informe consolidado en archivo PDF con balance de ventas, clientes y métricas operativas.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="px-6 py-3.5 bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Procesando y descargando PDF...
            </>
          ) : downloadSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> ¡PDF Descargado Exitosamente!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Descargar Reporte en PDF
            </>
          )}
        </button>
      </div>

      {/* DOCUMENTO DE REPORTE VISUAL EN PANTALLA */}
      <div id="reporte-pdf" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Encabezado del Reporte con Logo Oficial */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-900 pb-6">
          <Logo size="lg" />
          <div className="text-left sm:text-right text-xs">
            <span className="text-lg font-black text-[#0F172A] block uppercase">INFORME EJECUTIVO DE VENTAS</span>
            <span className="text-slate-500 block">Periodo: {reportData.period}</span>
            <span className="text-[11px] font-mono text-slate-400">Generado el: {reportData.generatedAt}</span>
          </div>
        </div>

        {/* Tarjetas Resumen de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Ventas Cotizadas</span>
            <span className="text-2xl font-black text-[#0F172A] mt-1 block">
              {formatCurrency(reportData.totalRevenue)}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">↑ 18.4% vs mes anterior</span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Clientes Nuevos Registrados</span>
            <span className="text-2xl font-black text-[#0284C7] mt-1 block">{reportData.newClientsCount} Empresas</span>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">Clientes verificados en web</span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Total Solicitudes de Pedido</span>
            <span className="text-2xl font-black text-[#F97316] mt-1 block">{reportData.totalOrders} Pedidos</span>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">100% procesados en plataforma</span>
          </div>
        </div>

        {/* Sección 1: Clientes Nuevos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Users className="w-5 h-5 text-[#0284C7]" />
            <h3 className="text-base font-extrabold text-slate-900">Listado de Clientes Nuevos y Compras</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-[#0F172A] font-bold uppercase">
                <tr>
                  <th className="p-3">Cliente Solicitante</th>
                  <th className="p-3">Correo Electrónico</th>
                  <th className="p-3">Empresa / Entidad</th>
                  <th className="p-3">Fecha</th>
                  <th className="p-3 text-right">Monto Cotizado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.recentClients.map((client, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{client.name}</td>
                    <td className="p-3 font-mono text-slate-600">{client.email}</td>
                    <td className="p-3 font-medium">{client.company}</td>
                    <td className="p-3 text-slate-500">{client.date}</td>
                    <td className="p-3 text-right font-extrabold text-[#0F172A]">{client.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sección 2: Desglose por Categorías Comercializadas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <TrendingUp className="w-5 h-5 text-[#F97316]" />
            <h3 className="text-base font-extrabold text-slate-900">Rendimiento por Línea de Negocio</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportData.categoriesPerformance.map((cat, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-900">{cat.name}</span>
                  <span className="text-[#0284C7]">{cat.percentage}% del total</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0284C7]"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{cat.ordersCount} Solicitudes</span>
                  <span className="font-bold text-slate-900">{formatCurrency(cat.totalCOP)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pie de Página del Reporte */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-2">
          <span>DOTACIONES & SUMINISTROS — Documento Confidencial Interno</span>
          <span>Exportado oficialmente en formato digital PDF desde la plataforma web</span>
        </div>

      </div>

    </div>
  );
}
