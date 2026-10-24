'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface CreateUserData {
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  role: 'USER' | 'ADMIN';
  password?: string;
}

export interface UpdateUserData {
  full_name: string;
  email?: string;
  phone?: string;
  company?: string;
  role: 'USER' | 'ADMIN';
}

/**
 * CREAR nuevo usuario/cliente desde el panel de administración
 */
export async function createUserAction(data: CreateUserData) {
  try {
    if (!data.full_name || !data.email) {
      return { success: false, error: 'El nombre y correo electrónico son obligatorios.' };
    }

    const email = data.email.toLowerCase().trim();
    const initialPassword = data.password && data.password.length >= 6 ? data.password : 'Suministros2026*';

    const adminClient = createAdminClient();

    // 1. Intentar crear usuario con la API de administración de Supabase Auth
    let authUserId: string | null = null;

    try {
      if (adminClient.auth?.admin?.createUser) {
        const { data: createdAuth, error: authErr } = await adminClient.auth.admin.createUser({
          email,
          password: initialPassword,
          email_confirm: true,
          user_metadata: {
            full_name: data.full_name,
            company: data.company || 'Empresa Registrada',
            phone: data.phone || '',
            role: data.role,
          },
        });

        if (!authErr && createdAuth?.user) {
          authUserId = createdAuth.user.id;
        }
      }
    } catch {
      // Ignorar fallo de admin auth si no tiene service_role
    }

    // 2. Si no se pudo crear con admin API, registrar mediante signUp estándar
    if (!authUserId) {
      const supabase = await createClient();
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email,
        password: initialPassword,
        options: {
          data: {
            full_name: data.full_name,
            company: data.company || 'Empresa Registrada',
            phone: data.phone || '',
            role: data.role,
          },
        },
      });

      if (signUpErr) {
        return { success: false, error: `Error de registro: ${signUpErr.message}` };
      }

      authUserId = signUpData.user?.id || null;
    }

    // 3. Asegurar que el perfil se inserte o actualice con el rol correcto en la tabla profiles
    if (authUserId) {
      const { error: profileErr } = await adminClient
        .from('profiles')
        .upsert({
          id: authUserId,
          full_name: data.full_name,
          email,
          company: data.company || 'Empresa Registrada',
          phone: data.phone || '',
          role: data.role,
          updated_at: new Date().toISOString(),
        });

      if (profileErr) {
        console.warn('[createUserAction profile upsert warning]:', profileErr);
      }
    }

    revalidatePath('/admin/usuarios');
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      message: `Usuario ${data.full_name} (${data.role}) creado exitosamente. Contraseña temporal: ${initialPassword}`,
    };
  } catch (err: any) {
    console.error('[createUserAction Exception]:', err);
    return { success: false, error: err.message || 'Error inesperado al crear usuario.' };
  }
}

/**
 * ACTUALIZAR datos y/o rol de un cliente/usuario
 */
export async function updateUserAction(userId: string, data: UpdateUserData) {
  try {
    if (!userId) {
      return { success: false, error: 'ID de usuario requerido.' };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('profiles')
      .update({
        full_name: data.full_name,
        company: data.company || null,
        phone: data.phone || null,
        role: data.role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('[updateUserAction Error]:', error);
      return { success: false, error: `Error al actualizar perfil: ${error.message}` };
    }

    // Opcional: Actualizar metadata en auth.users si admin API está disponible
    try {
      if (adminClient.auth?.admin?.updateUserById) {
        await adminClient.auth.admin.updateUserById(userId, {
          user_metadata: {
            full_name: data.full_name,
            company: data.company || '',
            phone: data.phone || '',
            role: data.role,
          },
        });
      }
    } catch {
      // Continuar si la metadata de auth no se pudo sincronizar
    }

    revalidatePath('/admin/usuarios');
    revalidatePath('/admin/dashboard');

    return { success: true, message: 'Usuario actualizado correctamente.' };
  } catch (err: any) {
    console.error('[updateUserAction Exception]:', err);
    return { success: false, error: err.message || 'Error inesperado al actualizar usuario.' };
  }
}

/**
 * CAMBIAR ROL directo (ADMIN <-> USER)
 */
export async function toggleUserRoleAction(userId: string, newRole: 'USER' | 'ADMIN') {
  try {
    if (!userId || !newRole) {
      return { success: false, error: 'Parámetros inválidos para cambio de rol.' };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('profiles')
      .update({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('[toggleUserRoleAction Error]:', error);
      return { success: false, error: `No se pudo cambiar el rol: ${error.message}` };
    }

    revalidatePath('/admin/usuarios');
    revalidatePath('/admin/dashboard');

    return { success: true, message: `Rol actualizado a ${newRole} con éxito.` };
  } catch (err: any) {
    console.error('[toggleUserRoleAction Exception]:', err);
    return { success: false, error: err.message || 'Error inesperado al cambiar rol.' };
  }
}

/**
 * ELIMINAR cliente/usuario de la base de datos
 */
export async function deleteUserAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: 'ID de usuario requerido para eliminación.' };
    }

    const adminClient = createAdminClient();

    // 1. Eliminar perfil de la tabla profiles
    const { error: profileDeleteErr } = await adminClient
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileDeleteErr) {
      console.error('[deleteUserAction Profile Error]:', profileDeleteErr);
      return { success: false, error: `Error al eliminar perfil: ${profileDeleteErr.message}` };
    }

    // 2. Si está disponible el cliente admin de auth, eliminar también de auth.users
    try {
      if (adminClient.auth?.admin?.deleteUser) {
        await adminClient.auth.admin.deleteUser(userId);
      }
    } catch {
      // Ignorar si no tiene permisos sobre auth.users
    }

    revalidatePath('/admin/usuarios');
    revalidatePath('/admin/dashboard');

    return { success: true, message: 'Usuario eliminado exitosamente del sistema.' };
  } catch (err: any) {
    console.error('[deleteUserAction Exception]:', err);
    return { success: false, error: err.message || 'Error inesperado al eliminar usuario.' };
  }
}
