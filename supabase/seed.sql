-- =====================================================================
-- DATOS DE PRUEBA (SEED) PARA "DOTACIONES & SUMINISTROS"
-- =====================================================================

-- 1. INSERTAR CATEGORÍAS INICIALES
INSERT INTO categories (id, name, slug, description, image_url, active, sort_order) VALUES
('c1111111-1111-1111-1111-111111111111', 'Dotación', 'dotacion', 'Uniformes empresariales, calzado industrial, vestuario de protección y EPP de alta durabilidad.', 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800', true, 1),
('c2222222-2222-2222-2222-222222222222', 'Ferretería', 'ferreteria', 'Herramientas manuales, mecánicas, eléctricas, tornillería y suministros de mantenimiento industrial.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800', true, 2),
('c3333333-3333-3333-3333-333333333333', 'Papelería', 'papeleria', 'Suministros de oficina, resmas de papel, útiles de escritura, carpetas y consumibles corporativos.', 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800', true, 3),
('c4444444-4444-4444-4444-444444444444', 'Aseo', 'aseo', 'Insumos de limpieza profesional, desinfectantes, toallas de papel, dispensadores y jabones industriales.', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800', true, 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. INSERTAR PRODUCTOS DESTACADOS Y DE PRUEBA

-- CATEGORÍA: DOTACIÓN
INSERT INTO products (id, category_id, name, slug, description, price, stock, active, featured, main_image_url) VALUES
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Botas de Seguridad Dielectricas', 'botas-de-seguridad-dielectricas', 'Botas industriales con puntera de policarbonato (composite), suela antideslizante resistente a hidrocarburos y certificación dieléctrica de hasta 18.000 voltios.', 185000.00, 50, true, true, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'),
('a1111112-1111-1111-1111-111111111112', 'c1111111-1111-1111-1111-111111111111', 'Chaleco de Malla Alta Visibilidad Reflex', 'chaleco-malla-alta-visibilidad', 'Chaleco industrial confeccionado en malla textil respirable con cintas reflectivas homologadas de 2 pulgadas para brigadistas y operarios de vialidad.', 35000.00, 120, true, true, 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'),
('a1111113-1111-1111-1111-111111111113', 'c1111111-1111-1111-1111-111111111111', 'Camisa Manga Larga Tipo Dril Industrial', 'camisa-manga-larga-dril-industrial', 'Camisa confeccionada en tela dril de algodón 100%, súper resistente a lavados continuos, con costuras reforzadas e ideal para trabajo en campo.', 68000.00, 80, true, false, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- CATEGORÍA: FERRETERÍA
INSERT INTO products (id, category_id, name, slug, description, price, stock, active, featured, main_image_url) VALUES
('a2222221-2222-2222-2222-222222222221', 'c2222222-2222-2222-2222-222222222222', 'Juego de Herramientas Manuales Profi 50 Pzas', 'juego-de-herramientas-manuales-profi', 'Maletín técnico de mantenimiento que incluye llaves mixtas, alicates de presión, destornilladores aislados VDE y trinquete de 1/2 pulgada.', 320000.00, 30, true, true, 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),
('a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'Cinta Métrica Flexómetro 8 Metros', 'flexometro-8m-alto-impacto', 'Flexómetro profesional con caja de goma resistente a caídas de 3 metros, cinta ancha recubierta en nylon y freno autolock.', 28000.00, 150, true, false, 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- CATEGORÍA: PAPELERÍA
INSERT INTO products (id, category_id, name, slug, description, price, stock, active, featured, main_image_url) VALUES
('a3333331-3333-3333-3333-333333333331', 'c3333333-3333-3333-3333-333333333333', 'Caja Resmas Papel Carta 75g (5 Resmas)', 'caja-resmas-papel-carta-75g', 'Caja institucional con 5 resmas de 500 hojas cada una. Alto grado de blancura (98%), apto para impresoras láser, inyección de tinta y fotocopiadoras.', 125000.00, 200, true, true, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),
('a3333332-3333-3333-3333-333333333332', 'c3333333-3333-3333-3333-333333333333', 'Caja de Bolígrafos Gel Azul x 50 Uds', 'caja-boligrafos-gel-azul-x50', 'Bolígrafos de tinta gel de secado rápido con punta fina de 0.7mm y cuerpo ergonómico para uso continuo en oficinas.', 45000.00, 100, true, false, 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- CATEGORÍA: ASEO
INSERT INTO products (id, category_id, name, slug, description, price, stock, active, featured, main_image_url) VALUES
('a4444441-4444-4444-4444-444444444441', 'c4444444-4444-4444-4444-444444444444', 'Detergente Desinfectante Amonio Cuaternario 5L', 'detergente-desinfectante-amonio-5l', 'Limpiador concentrado hospitalario e industrial con poder bactericida, virucida y fungicida de amplio espectro. Biodegradable.', 48000.00, 90, true, true, 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'),
('a4444442-4444-4444-4444-444444444442', 'c4444444-4444-4444-4444-444444444444', 'Caja Toalla de Manos Doblada Z (2400 Hojas)', 'caja-toalla-manos-doblada-z', 'Caja con 24 paquetes de 100 hojas de toalla de manos en papel de alta absorción hoja doble, ideal para dispensadores institucionales.', 89000.00, 110, true, false, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERTAR CARACTERÍSTICAS TÉCNICAS
INSERT INTO product_features (product_id, name, value) VALUES
('a1111111-1111-1111-1111-111111111111', 'Tallas Disponibles', '37 a 44'),
('a1111111-1111-1111-1111-111111111111', 'Material', 'Cuero Vacuno Encerado'),
('a1111111-1111-1111-1111-111111111111', 'Puntera', 'Composite (No metálica)'),
('a1111111-1111-1111-1111-111111111111', 'Normativa', 'ASTM F2413-18 / EN ISO 20345'),
('a2222221-2222-2222-2222-222222222221', 'Piezas', '50 Elementos'),
('a2222221-2222-2222-2222-222222222221', 'Material', 'Cromo Vanadio Reforzado'),
('a3333331-3333-3333-3333-333333333331', 'Gramaje', '75 g/m²'),
('a3333331-3333-3333-3333-333333333331', 'Tamaño', 'Carta (21.6 x 27.9 cm)'),
('a4444441-4444-4444-4444-444444444441', 'Rendimiento', 'Rinde hasta 250 Litros de solución'),
('a4444441-4444-4444-4444-444444444441', 'Registro Sanitario', 'INVIMA Vigente');
