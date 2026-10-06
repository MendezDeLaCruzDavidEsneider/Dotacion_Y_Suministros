import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const hasAdminCookie = request.cookies.get('admin_session')?.value === 'true';

  let user = null;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder',
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
              supabaseResponse = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) =>
                supabaseResponse.cookies.set(name, value, options)
              );
            } catch {
              // Ignore cookie set errors in middleware
            }
          },
        },
      }
    );

    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    user = null;
  }

  // Protección de rutas administrativas /admin/*
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Si intenta ingresar a la ruta obsoleta /admin/login
    if (request.nextUrl.pathname === '/admin/login') {
      const url = request.nextUrl.clone();
      url.pathname = hasAdminCookie ? '/admin/dashboard' : '/login';
      return NextResponse.redirect(url);
    }

    // Si intenta acceder a cualquier subruta /admin sin sesión de admin
    if (!user && !hasAdminCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
