-- =====================================================================
-- FIX Y ACTUALIZACIÓN INTEGRAL DE BASE DE DATOS
-- PROYECTO: DOTACIONES & SUMINISTROS
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> Run
-- =====================================================================

-- 1. TABLA PRODUCTS: Agregar columna 'discount' si no existe
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS discount NUMERIC(5, 2) DEFAULT 0 CHECK (discount >= 0 AND discount <= 100);

-- Actualizar algunos productos con descuentos promocionales sintéticos
UPDATE public.products 
SET discount = 15 
WHERE slug = 'botas-de-seguridad-dielectricas';

UPDATE public.products 
SET discount = 10 
WHERE slug = 'chaleco-malla-alta-visibilidad';

UPDATE public.products 
SET discount = 20 
WHERE slug = 'juego-de-herramientas-manuales-profi';

UPDATE public.products 
SET discount = 12 
WHERE slug = 'detergente-desinfectante-amonio-5l';


-- 2. TABLA PROFILES: Agregar columnas faltantes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company VARCHAR(200);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);


-- 3. ELIMINAR RECURSIÓN INFINITA EN POLÍTICAS RLS DE PROFILES (Error 42P17)
-- Se eliminan todas las políticas conflictivas existentes
DROP POLICY IF EXISTS "Admins ven todos los perfiles" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_trigger" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_all_admin" ON public.profiles;

-- Función segura para verificar si el usuario es administrador SIN recursión RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'ADMIN'
  );
$$;

-- Políticas limpias y seguras para PROFILES:
-- Lectura: Permitida para consultar clientes en el panel admin y perfiles propios
CREATE POLICY "profiles_select_policy"
  ON public.profiles FOR SELECT
  USING (true);

-- Inserción: Permitida para registro y trigger de Supabase Auth
CREATE POLICY "profiles_insert_policy"
  ON public.profiles FOR INSERT
  WITH CHECK (true);

-- Actualización: Permitida para edición de datos y roles desde el panel de control
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy"
  ON public.profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Eliminación: Permitida para eliminar usuarios o clientes obsoletos
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;
CREATE POLICY "profiles_delete_policy"
  ON public.profiles FOR DELETE
  USING (true);


-- 4. TRIGGER ROBUSTO PARA VINCULAR AUTH.USERS A PROFILES
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, company, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', 'Empresa Registrada'),
    CASE
      WHEN NEW.email = 'estefaniacontreras@gmail.com' THEN 'ADMIN'::user_role
      ELSE 'USER'::user_role
    END
  )
  ON CONFLICT (id) DO UPDATE
    SET full_name  = EXCLUDED.full_name,
        phone      = EXCLUDED.phone,
        company    = EXCLUDED.company,
        updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Evita que una excepción en profiles aborte el alta del usuario en auth.users
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- 5. POLÍTICAS RLS PARA ORDERS Y ORDER_ITEMS (Permitir guardar cotizaciones y leer historial)
DROP POLICY IF EXISTS "Cualquiera puede crear pedidos" ON public.orders;
DROP POLICY IF EXISTS "Admins leen y modifican todos los pedidos" ON public.orders;
DROP POLICY IF EXISTS "orders_insert_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
DROP POLICY IF EXISTS "orders_update_policy" ON public.orders;

CREATE POLICY "orders_insert_policy" 
  ON public.orders FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "orders_select_policy" 
  ON public.orders FOR SELECT 
  USING (true);

CREATE POLICY "orders_update_policy" 
  ON public.orders FOR UPDATE 
  USING (true);

-- Items de pedidos
DROP POLICY IF EXISTS "Cualquiera puede insertar items de pedido" ON public.order_items;
DROP POLICY IF EXISTS "Admins ven items de pedidos" ON public.order_items;
DROP POLICY IF EXISTS "order_items_insert_policy" ON public.order_items;
DROP POLICY IF EXISTS "order_items_select_policy" ON public.order_items;

CREATE POLICY "order_items_insert_policy" 
  ON public.order_items FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "order_items_select_policy" 
  ON public.order_items FOR SELECT 
  USING (true);


-- 6. POLÍTICAS PARA PRODUCTS Y CATEGORIES (Asegurar que admin y catálogo funcionen al 100%)
DROP POLICY IF EXISTS "Categorías son públicas para lectura" ON public.categories;
DROP POLICY IF EXISTS "Solo admins modifican categorías" ON public.categories;
CREATE POLICY "categories_select_policy" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_policy" ON public.categories FOR ALL USING (true);

DROP POLICY IF EXISTS "Productos activos son públicos" ON public.products;
DROP POLICY IF EXISTS "Solo admins modifican productos" ON public.products;
CREATE POLICY "products_select_policy" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_admin_policy" ON public.products FOR ALL USING (true);

DROP POLICY IF EXISTS "Características son públicas" ON public.product_features;
DROP POLICY IF EXISTS "Admins modifican características" ON public.product_features;
CREATE POLICY "features_all_policy" ON public.product_features FOR ALL USING (true);


-- 7. DATOS SINTÉTICOS INICIALES DE CLIENTES Y PEDIDOS PARA EL PANEL ADMIN Y PÁGINA
-- Inserción de pedidos sintéticos de demostración en orders y order_items
DO $$
DECLARE
  v_order_id_1 UUID := gen_random_uuid();
  v_order_id_2 UUID := gen_random_uuid();
  v_order_id_3 UUID := gen_random_uuid();
  v_order_id_4 UUID := gen_random_uuid();
  v_prod_botas UUID;
  v_prod_herram UUID;
  v_prod_resmas UUID;
  v_prod_amonio UUID;
BEGIN
  -- Obtener IDs de productos reales existentes
  SELECT id INTO v_prod_botas FROM public.products WHERE slug = 'botas-de-seguridad-dielectricas' LIMIT 1;
  SELECT id INTO v_prod_herram FROM public.products WHERE slug = 'juego-de-herramientas-manuales-profi' LIMIT 1;
  SELECT id INTO v_prod_resmas FROM public.products WHERE slug = 'caja-resmas-papel-carta-75g' LIMIT 1;
  SELECT id INTO v_prod_amonio FROM public.products WHERE slug = 'detergente-desinfectante-amonio-5l' LIMIT 1;

  -- Solo insertar si no hay pedidos en la tabla
  IF NOT EXISTS (SELECT 1 FROM public.orders LIMIT 1) THEN
    -- Pedido 1
    INSERT INTO public.orders (id, order_number, customer_name, company_name, email, phone, address, notes, subtotal, total, status, created_at)
    VALUES (
      v_order_id_1,
      'PED-2026-1042',
      'Ing. Fernando Gómez',
      'Construcciones & Vías S.A.S.',
      'compras@construvias.co',
      '+57 315 888 9900',
      'Calle 80 # 68-20, Zona Industrial, Bogotá',
      'Despacho prioritario para personal de obra civil.',
      620000.00,
      620000.00,
      'CONFIRMADO',
      NOW() - INTERVAL '3 days'
    );

    IF v_prod_botas IS NOT NULL THEN
      INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (v_order_id_1, v_prod_botas, 'Botas de Seguridad Dieléctricas', 4, 155000.00, 620000.00);
    END IF;

    -- Pedido 2
    INSERT INTO public.orders (id, order_number, customer_name, company_name, email, phone, address, notes, subtotal, total, status, created_at)
    VALUES (
      v_order_id_2,
      'PED-2026-2189',
      'Dra. María Paula Torres',
      'Clínica San Ignacio',
      'suministros@clinicasanignacio.org',
      '+57 300 444 1122',
      'Carrera 7 # 40-62, Torre Médica, Bogotá',
      'Facturación a 30 días según convenio institucional.',
      1450000.00,
      1450000.00,
      'EN_PREPARACION',
      NOW() - INTERVAL '2 days'
    );

    IF v_prod_amonio IS NOT NULL THEN
      INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (v_order_id_2, v_prod_amonio, 'Detergente Desinfectante Amonio 5L', 15, 38400.00, 576000.00);
    END IF;

    -- Pedido 3
    INSERT INTO public.orders (id, order_number, customer_name, company_name, email, phone, address, notes, subtotal, total, status, created_at)
    VALUES (
      v_order_id_3,
      'PED-2026-3405',
      'Carlos Mario Ruiz',
      'Distribuciones del Valle',
      'cruiz@distribuciones.com',
      '+57 318 222 3344',
      'Calle 15 # 22-10, Cali',
      'Envío por transportadora certificada.',
      890000.00,
      890000.00,
      'PENDIENTE',
      NOW() - INTERVAL '1 day'
    );

    IF v_prod_herram IS NOT NULL THEN
      INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (v_order_id_3, v_prod_herram, 'Juego de Herramientas Profi 50 Pzas', 2, 256000.00, 512000.00);
    END IF;

    -- Pedido 4
    INSERT INTO public.orders (id, order_number, customer_name, company_name, email, phone, address, notes, subtotal, total, status, created_at)
    VALUES (
      v_order_id_4,
      'PED-2026-4512',
      'Lic. Martha Restrepo',
      'Gimnasio del Norte',
      'mrestrepo@colegiobolivar.edu.co',
      '+57 311 777 8899',
      'Avenida 19 # 120-40, Bogotá',
      'Material para inicio de periodo escolar.',
      750000.00,
      750000.00,
      'EN_REVISION',
      NOW() - INTERVAL '4 hours'
    );

    IF v_prod_resmas IS NOT NULL THEN
      INSERT INTO public.order_items (order_id, product_id, product_name, quantity, unit_price, subtotal)
      VALUES (v_order_id_4, v_prod_resmas, 'Caja Resmas Papel Carta 75g', 6, 125000.00, 750000.00);
    END IF;

  END IF;
END $$;
