-- =====================================================================
-- ESQUEMA DE BASE DE DATOS PARA "DOTACIONES & SUMINISTROS"
-- PostgreSQL / Supabase
-- =====================================================================

-- 1. TIPOS ENUMERADOS
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER');

CREATE TYPE order_status AS ENUM (
  'PENDIENTE',
  'EN_REVISION',
  'CONFIRMADO',
  'EN_PREPARACION',
  'ENVIADO',
  'COMPLETADO',
  'CANCELADO'
);

-- 2. TABLA PROFILES (Perfiles vinculados a Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role user_role DEFAULT 'USER' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. TABLA CATEGORIES (Categorías del Catálogo)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. TABLA PRODUCTS (Catálogo de Productos)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock INT DEFAULT 0 NOT NULL CHECK (stock >= 0),
  active BOOLEAN DEFAULT TRUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE NOT NULL,
  main_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. TABLA PRODUCT_FEATURES (Características técnicas / Especificaciones)
CREATE TABLE product_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. TABLA PRODUCT_IMAGES (Galería de imágenes adicionales)
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(200),
  sort_order INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. TABLA ORDERS (Pedidos / Solicitudes de Cotización)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) UNIQUE NOT NULL, -- Ej: PED-2026-0001
  customer_name VARCHAR(150) NOT NULL,
  company_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT,
  notes TEXT,
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
  total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
  status order_status DEFAULT 'PENDIENTE' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. TABLA ORDER_ITEMS (Detalle de Productos por Pedido)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 9. ÍNDICES DE RENDIMIENTO
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- 10. TRIGGER PARA UPDATE DE TIMESTAMPS AUTOMÁTICO
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 11. TRIGGER PARA VINCULAR REGISTROS DE AUTH A PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'ADMIN' -- Primeros registrados asignados como ADMIN si se requiere
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 12. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS BÁSICAS
-- Categorías: Lectura Pública, Escritura solo Autenticados (Admin)
CREATE POLICY "Categorías son públicas para lectura" ON categories FOR SELECT USING (true);
CREATE POLICY "Solo admins modifican categorías" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Productos: Lectura Pública si están activos, Escritura solo Autenticados (Admin)
CREATE POLICY "Productos activos son públicos" ON products FOR SELECT USING (active = true OR auth.role() = 'authenticated');
CREATE POLICY "Solo admins modifican productos" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Características e imágenes: Lectura Pública
CREATE POLICY "Características son públicas" ON product_features FOR SELECT USING (true);
CREATE POLICY "Admins modifican características" ON product_features FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Imágenes son públicas" ON product_images FOR SELECT USING (true);
CREATE POLICY "Admins modifican imágenes" ON product_images FOR ALL USING (auth.role() = 'authenticated');

-- Pedidos: Creación pública, Lectura y gestión solo Admins
CREATE POLICY "Cualquiera puede crear pedidos" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins leen y modifican todos los pedidos" ON orders FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Cualquiera puede insertar items de pedido" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins ven items de pedidos" ON order_items FOR ALL USING (auth.role() = 'authenticated');
