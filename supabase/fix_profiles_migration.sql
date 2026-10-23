-- =====================================================================
-- FIX COMPLETO: Trigger y tabla profiles con todos los campos
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =====================================================================

-- PASO 1: Eliminar el trigger y la función anteriores
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- PASO 2: Agregar columnas faltantes a profiles de forma segura
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company VARCHAR(200);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone   VARCHAR(50);

-- PASO 3: Crear la función del trigger de nuevo, limpia y robusta
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'company', ''),
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
END;
$$;

-- PASO 4: Recrear el trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- PASO 5: Eliminar políticas RLS anteriores que puedan causar conflicto
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil"        ON profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Admins ven todos los perfiles"               ON profiles;
DROP POLICY IF EXISTS "profiles_select_own"                         ON profiles;
DROP POLICY IF EXISTS "profiles_update_own"                         ON profiles;

-- PASO 6: Crear políticas RLS correctas
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (true);  -- cualquier usuario autenticado puede leer (admin necesita ver todos)

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_trigger"
  ON profiles FOR INSERT
  WITH CHECK (true);  -- el trigger necesita insertar sin restricciones
