import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { LoginModal } from '@/components/auth/LoginModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DOTACIONES & SUMINISTROS | Soluciones Integrales Empresariales',
  description:
    'Catálogo comercial y suministro de dotación laboral, herramientas de ferretería, papelería de oficina e insumos de aseo industrial para empresas y entidades.',
  keywords: [
    'Dotaciones',
    'Suministros',
    'Ferretería industrial',
    'Papelería corporativa',
    'Insumos de aseo',
    'Uniformes de trabajo',
    'Cotización empresarial',
  ],
  authors: [{ name: 'DOTACIONES & SUMINISTROS' }],
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#0284C7] selection:text-white">
        <Header />
        <CartDrawer />
        <LoginModal />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
