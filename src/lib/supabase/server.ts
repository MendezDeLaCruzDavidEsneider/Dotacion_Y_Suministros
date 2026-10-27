import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se ignora si fue llamado desde un Server Component puro
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // El service_role key de Supabase es siempre un JWT (comienza con "eyJ").
  // Un Publishable Key ("sb_publishable_...") o un placeholder no tienen permisos admin.
  const isServiceKeyValid =
    typeof serviceKey === 'string' &&
    serviceKey.startsWith('eyJ') &&
    serviceKey.length > 100;

  if (!isServiceKeyValid) {
    console.warn(
      '[createAdminClient] SUPABASE_SERVICE_ROLE_KEY inválido o no configurado. ' +
      'Las operaciones de escritura sobre profiles pueden fallar por RLS. ' +
      'Configura el service_role JWT real en .env.local'
    );
  }

  const keyToUse = isServiceKeyValid ? serviceKey! : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
