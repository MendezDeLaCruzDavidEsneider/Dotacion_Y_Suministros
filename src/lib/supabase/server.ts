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
  const isServiceKeyValid = serviceKey && !serviceKey.includes('placeholder');
  const keyToUse = isServiceKeyValid ? serviceKey : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
