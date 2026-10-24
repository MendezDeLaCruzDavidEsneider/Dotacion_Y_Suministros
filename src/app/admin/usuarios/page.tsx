import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { UsersTableClient, UserProfile } from '@/components/admin/UsersTableClient';

export const revalidate = 0; // Datos siempre en vivo

export default async function AdminUsersPage() {
  let profiles: UserProfile[] = [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      profiles = data.map((u: any) => ({
        id: u.id,
        full_name: u.full_name || '',
        email: u.email,
        phone: u.phone,
        company: u.company,
        role: u.role as 'USER' | 'ADMIN',
        created_at: u.created_at,
      }));
    }
  } catch (err) {
    console.error('Error al obtener usuarios en admin:', err);
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Gestión Integral de Usuarios y Clientes (CRUD)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Administre cuentas corporativas, registre nuevos usuarios, modifique datos de contacto, elimine registros y configure roles (ADMIN / CLIENTE).
          </p>
        </div>
      </div>

      {/* Componente Interactivo CRUD */}
      <UsersTableClient initialUsers={profiles} />
    </div>
  );
}
