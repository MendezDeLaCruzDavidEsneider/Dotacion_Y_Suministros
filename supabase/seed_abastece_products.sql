-- =====================================================================
-- SEED DE PRODUCTOS BASADO EN CATÁLOGO DE ABASTECE.CO
-- PROYECTO: DOTACIONES & SUMINISTROS
-- 
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> Run
--
-- Categorías existentes:
--   Dotación:    c1111111-1111-1111-1111-111111111111
--   Ferretería:  c2222222-2222-2222-2222-222222222222
--   Papelería:   c3333333-3333-3333-3333-333333333333
--   Aseo:        c4444444-4444-4444-4444-444444444444
-- =====================================================================

-- ═══════════════════════════════════════════════════════════════════════
-- CATEGORÍA: ASEO (c4444444-4444-4444-4444-444444444444)
-- Referencia: abastece.co - Elementos de Aseo Institucional
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES

-- ── Ambientadores ──
('c4444444-4444-4444-4444-444444444444',
 'Ambientador Líquido Lavanda 3000ml - Potente',
 'ambientador-liquido-lavanda-3000ml-potente',
 'Ambientador líquido concentrado con fragancia de lavanda natural de larga duración. Ideal para áreas comunes, oficinas, baños institucionales y recepciones. Presentación de 3000 ml con dispensador. Marca Potente.',
 23014.00, 20, 80, true, false,
 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Ambientador Líquido Manzana 20 Litros - Potente',
 'ambientador-liquido-manzana-20l-potente',
 'Ambientador líquido industrial en presentación de 20 litros con aroma a manzana verde. Formulación concentrada de alto rendimiento para grandes superficies, bodegas y plantas industriales. Marca Potente.',
 135140.00, 20, 40, true, true,
 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800'),

-- ── Ceras y Pisos ──
('c4444444-4444-4444-4444-444444444444',
 'Cera Polimérica Autobrillante Blanca 3000ml - Potente',
 'cera-polimerica-autobrillante-3000ml-potente',
 'Cera polimérica autobrillante de alta resistencia al tráfico para pisos de vinilo, porcelanato y mármol. Acabado brillante de larga duración sin necesidad de máquina brilladora. Presentación 3000 ml.',
 67235.00, 20, 60, true, true,
 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Cera Polimérica Autobrillante Blanca 20 Litros - Potente',
 'cera-polimerica-autobrillante-20l-potente',
 'Cera polimérica autobrillante para pisos de alto tráfico en presentación industrial de 20 litros. Resistente al agua y al tránsito continuo. Ideal para centros comerciales, hospitales y oficinas corporativas.',
 393604.00, 20, 25, true, false,
 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Cera Tráfico Pesado Autobrillante 3000ml - Potente',
 'cera-trafico-pesado-autobrillante-3000ml',
 'Cera autobrillante de grado industrial diseñada para pisos sometidos a tráfico pesado. Formulación premium con polímeros de alta durabilidad y acabado antideslizante. Presentación 3000 ml.',
 76655.00, 20, 50, true, false,
 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=800'),

-- ── Desmanchadores y Desinfectantes ──
('c4444444-4444-4444-4444-444444444444',
 'Desmanchador Desinfectante Limpiajuntas Spray 500ml',
 'desmanchador-desinfectante-limpiajuntas-spray-500ml',
 'Limpiador desinfectante en spray para limpieza profunda de juntas de baldosas, porcelanato y superficies esmaltadas. Acción bactericida y blanqueadora. Formato spray de 500 ml listo para usar.',
 9664.00, 20, 150, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Desmanchador Desinfectante Limpiajuntas 3800ml',
 'desmanchador-desinfectante-limpiajuntas-3800ml',
 'Limpiador desinfectante concentrado para juntas, baldosas y superficies duras. Acción profunda contra bacterias, hongos y manchas incrustadas. Presentación profesional de 3800 ml para uso institucional.',
 31896.00, 20, 90, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'),

-- ── Lavaloza y Cocina ──
('c4444444-4444-4444-4444-444444444444',
 'Lavaloza en Crema Multipower Limón 850g - Blancox',
 'lavaloza-crema-multipower-limon-850g-blancox',
 'Lavaloza en crema con poder desengrasante triple acción y aroma a limón. Suave con las manos y eficaz contra la grasa incrustada. Marca Blancox, presentación 850 gramos.',
 10874.00, 20, 200, true, false,
 'https://images.unsplash.com/photo-1585421514284-6dc1a5e0a0b0?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Jabón Líquido Lavaloza Premium Limón 3800ml - Briz',
 'jabon-liquido-lavaloza-premium-limon-3800ml-briz',
 'Jabón líquido lavaloza línea premium con fragancia a limón fresco. Alta concentración espumante para cocinas industriales, cafeterías y restaurantes corporativos. Marca Briz, presentación 3800 ml.',
 15758.00, 20, 120, true, false,
 'https://images.unsplash.com/photo-1585421514284-6dc1a5e0a0b0?auto=format&fit=crop&q=80&w=800'),

-- ── Papel Higiénico y Toallas ──
('c4444444-4444-4444-4444-444444444444',
 'Papel Higiénico Jumbo Blanco Hoja Doble x 4 Rollos',
 'papel-higienico-jumbo-blanco-hoja-doble-x4',
 'Papel higiénico institucional jumbo de hoja doble, alta blancura y suavidad. Cada rollo contiene 250 metros lineales. Caja de 4 rollos para dispensadores institucionales de baños corporativos.',
 58900.00, 0, 100, true, true,
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Toalla de Manos Doblada en Z Blanca x 150 Hojas',
 'toalla-manos-doblada-z-blanca-x150',
 'Toalla de manos interfoliada doblada en Z de papel blanco hoja doble. Alta absorción y resistencia en húmedo. Paquete de 150 hojas compatible con dispensadores institucionales estándar.',
 8500.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800'),

-- ── Bolsas de Basura ──
('c4444444-4444-4444-4444-444444444444',
 'Bolsa de Basura Negra 65x87cm Calibre 1.4 x 100 Uds',
 'bolsa-basura-negra-65x87-calibre-14-x100',
 'Bolsas de basura institucionales en polietileno de alta densidad calibre 1.4. Medida 65x87 cm ideal para canecas de oficina y papeleras. Paquete por 100 unidades. Resistentes al rasgado.',
 22500.00, 0, 180, true, false,
 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Bolsa de Basura Negra 70x100cm Calibre 2.0 x 100 Uds',
 'bolsa-basura-negra-70x100-calibre-20-x100',
 'Bolsas de basura industriales extra resistentes en polietileno calibre 2.0. Medida 70x100 cm para canecas grandes y contenedores de residuos. Paquete por 100 unidades con sello térmico reforzado.',
 38500.00, 0, 140, true, false,
 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Bolsa de Basura Verde Reciclaje 65x87cm x 100 Uds',
 'bolsa-basura-verde-reciclaje-65x87-x100',
 'Bolsas de basura color verde para clasificación de residuos reciclables según normatividad ambiental colombiana. Calibre 1.4, medida 65x87 cm. Paquete por 100 unidades.',
 24000.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800'),

-- ── Jabones y Dispensadores ──
('c4444444-4444-4444-4444-444444444444',
 'Jabón Líquido Antibacterial para Manos 1000ml',
 'jabon-liquido-antibacterial-manos-1000ml',
 'Jabón líquido antibacterial con pH balanceado y emolientes que protegen la piel. Formulación hipoalergénica para dispensadores institucionales de baños y cocinas. Presentación de 1000 ml.',
 12800.00, 10, 200, true, true,
 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Gel Antibacterial para Manos 1000ml',
 'gel-antibacterial-manos-1000ml',
 'Gel antibacterial con 70% de alcohol y aloe vera para hidratación. Elimina el 99.9% de gérmenes y bacterias sin necesidad de agua. Presentación de 1000 ml con dispensador push.',
 18500.00, 0, 160, true, false,
 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&q=80&w=800'),

-- ── Desengrasantes ──
('c4444444-4444-4444-4444-444444444444',
 'Desengrasante Industrial Multiusos 3800ml',
 'desengrasante-industrial-multiusos-3800ml',
 'Desengrasante concentrado de acción profunda para superficies de cocina, campanas extractoras, pisos industriales y maquinaria. Biodegradable y de rápida acción. Presentación 3800 ml.',
 28900.00, 15, 100, true, false,
 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Hipoclorito de Sodio al 5.25% x 3800ml',
 'hipoclorito-sodio-525-3800ml',
 'Blanqueador y desinfectante líquido a base de hipoclorito de sodio al 5.25%. Apto para desinfección de superficies, pisos, baños y áreas de preparación de alimentos. Registro INVIMA vigente.',
 8900.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'),

-- ── Implementos de Aseo ──
('c4444444-4444-4444-4444-444444444444',
 'Trapero de Algodón Industrial 400g con Cabo',
 'trapero-algodon-industrial-400g-con-cabo',
 'Trapero de hilaza de algodón 100% de 400 gramos con cabo de madera reforzado de 1.50 metros. Alta absorción y durabilidad para pisos de alto tráfico. Ideal para oficinas y plantas industriales.',
 18200.00, 0, 90, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Escoba Suave Multiusos con Cabo de Madera',
 'escoba-suave-multiusos-cabo-madera',
 'Escoba de cerdas suaves de PVC para barrido de interiores, oficinas y pisos delicados. Cabo de madera natural de 1.20 metros con rosca universal. Diseño ergonómico de larga duración.',
 12500.00, 0, 130, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Recogedor Plástico Resistente con Mango Largo',
 'recogedor-plastico-resistente-mango-largo',
 'Recogedor de basura en plástico de alta resistencia con mango largo ergonómico de 85 cm. Labio de goma antiadherente para recoger partículas finas. Ideal para uso institucional y comercial.',
 9800.00, 0, 150, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Guantes de Caucho Calibre 25 Talla M - Par',
 'guantes-caucho-calibre-25-talla-m',
 'Par de guantes de caucho natural calibre 25 para labores de aseo y limpieza general. Textura antideslizante en palma y dedos. Resistentes a detergentes y químicos de limpieza. Talla M.',
 5200.00, 0, 300, true, false,
 'https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&q=80&w=800'),

-- ── Silicona y Multiusos ──
('c4444444-4444-4444-4444-444444444444',
 'Silicona Líquida Multiusos con Protección UV 500ml',
 'silicona-liquida-multiusos-proteccion-uv-500ml',
 'Silicona líquida multiusos con filtro UV para proteger y dar brillo a superficies plásticas, de cuero, caucho y vinilo. Aroma fresco de larga duración. Ideal para muebles de oficina y vehículos.',
 14500.00, 0, 110, true, false,
 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&q=80&w=800'),

('c4444444-4444-4444-4444-444444444444',
 'Limpiavidrios Multiusos Spray 500ml',
 'limpiavidrios-multiusos-spray-500ml',
 'Limpiavidrios profesional de acción rápida sin residuos. Fórmula antiempañante para vidrios, espejos, pantallas y superficies brillantes. Spray de 500 ml con gatillo ergonómico.',
 7800.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80&w=800')

ON CONFLICT (slug) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════
-- CATEGORÍA: DOTACIÓN (c1111111-1111-1111-1111-111111111111)
-- Referencia: abastece.co - Seguridad, Botiquín y Dotaciones
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES

-- ── Protección de Cabeza ──
('c1111111-1111-1111-1111-111111111111',
 'Casco de Seguridad Industrial Dieléctrico Blanco',
 'casco-seguridad-industrial-dielectrico-blanco',
 'Casco de seguridad industrial clase E (dieléctrico) con suspensión de 6 puntos ajustable tipo matraca. Fabricado en polietileno de alta densidad. Resistente a impactos y penetración según norma ANSI Z89.1.',
 45000.00, 0, 80, true, true,
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Tafilete Suspensión 6 Puntos para Casco Insafe',
 'tafilete-suspension-6-puntos-casco-insafe',
 'Sistema de suspensión de reemplazo con 6 puntos de apoyo para cascos de seguridad marca Insafe. Diseño de absorción de impacto con bandas de nylon trenzado. Ajuste tipo matraca para mayor comodidad.',
 18500.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Barbuquejo Elástico para Casco de Seguridad',
 'barbuquejo-elastico-casco-seguridad',
 'Barbuquejo elástico con mentonera acolchada y gancho de fijación rápida para cascos industriales. Sujeta el casco de forma segura durante trabajos en altura o con viento. Material elástico resistente.',
 6500.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'),

-- ── Protección Respiratoria ──
('c1111111-1111-1111-1111-111111111111',
 'Tapabocas Termosellado Azul x 50 Unidades',
 'tapabocas-termosellado-azul-x50',
 'Caja de 50 tapabocas termosellados desechables de 3 capas con filtración bacteriana ≥95%. Diseño anatómico con clip nasal ajustable y elásticos de alta resistencia. Empaque individual.',
 25000.00, 0, 300, true, true,
 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Respirador N95 de 5 Capas x 20 Unidades',
 'respirador-n95-5-capas-x20',
 'Caja de 20 respiradores N95 de 5 capas con filtración de partículas ≥95%. Diseño plegable tipo copa con clip nasal de aluminio y bandas elásticas ajustables. Certificación NIOSH. Ideal para ambientes con material particulado.',
 68000.00, 10, 120, true, true,
 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Mascarilla para Polvo Desechable x 50 Unidades',
 'mascarilla-polvo-desechable-x50',
 'Caja de 50 mascarillas desechables para protección contra polvo grueso y partículas no tóxicas. Tira nasal ajustable y elástico de sujeción. Ideal para labores de limpieza, carpintería y construcción ligera.',
 15000.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&q=80&w=800'),

-- ── Protección de Manos ──
('c1111111-1111-1111-1111-111111111111',
 'Guantes de Nitrilo Negro Sin Talco x 100 Uds - Talla M',
 'guantes-nitrilo-negro-sin-talco-x100-talla-m',
 'Caja de 100 guantes de nitrilo negro sin talco (powder-free) de uso industrial y hospitalario. Texturizado en dedos para mejor agarre. Resistentes a solventes, aceites y químicos. Talla M.',
 42000.00, 0, 150, true, true,
 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Guantes de Vaqueta para Trabajo Pesado - Par',
 'guantes-vaqueta-trabajo-pesado-par',
 'Par de guantes industriales de cuero vaqueta natural con refuerzo en palma y pulgar. Costuras dobles con hilo de nylon. Ideales para manipulación de carga, soldadura ligera y trabajo mecánico.',
 22000.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Guantes de Carnaza Tipo Ingeniero Largo - Par',
 'guantes-carnaza-tipo-ingeniero-largo-par',
 'Par de guantes de carnaza tipo ingeniero de 14 pulgadas de largo con refuerzo en palma, dedos y muñeca. Ideales para soldadura, manipulación de metales calientes y trabajos de fundición.',
 28000.00, 0, 90, true, false,
 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'),

-- ── Protección Visual y Auditiva ──
('c1111111-1111-1111-1111-111111111111',
 'Gafas de Seguridad Lente Claro Antiempañante',
 'gafas-seguridad-lente-claro-antiempanante',
 'Gafas de seguridad con lente de policarbonato claro y recubrimiento antiempañante y antirrayadura. Patillas ajustables con protección lateral. Cumplen norma ANSI Z87.1. Peso ligero para uso prolongado.',
 12000.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Tapaoídos de Inserción con Cordón x 100 Pares',
 'tapaoidos-insercion-cordon-x100-pares',
 'Caja de 100 pares de tapaoídos de inserción en espuma de poliuretano con cordón de nylon. Reducción de ruido NRR 29 dB. Hipoalergénicos y desechables. Ideales para entornos industriales con ruido constante.',
 45000.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'),

-- ── Calzado de Seguridad ──
('c1111111-1111-1111-1111-111111111111',
 'Botas de Seguridad Punta de Acero Negras',
 'botas-seguridad-punta-acero-negras',
 'Botas de seguridad industrial con puntera de acero, suela antideslizante resistente a aceites e hidrocarburos. Fabricadas en cuero vacuno con forro interior transpirable. Tallas 37 a 44. Norma ASTM F2413.',
 165000.00, 10, 60, true, true,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Botas Plásticas de Seguridad PVC Caña Alta',
 'botas-plasticas-seguridad-pvc-cana-alta',
 'Botas de seguridad en PVC de caña alta (40 cm) con suela antideslizante y puntera de acero integrada. Resistentes a agua, aceites y ácidos diluidos. Ideales para agricultura, plantas de alimentos y aseo.',
 52000.00, 0, 80, true, false,
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800'),

-- ── Dotación Corporativa ──
('c1111111-1111-1111-1111-111111111111',
 'Camisa de Dotación Azul Oscuro Manga Corta',
 'camisa-dotacion-azul-oscuro-manga-corta',
 'Camisa de dotación empresarial en tela dril de algodón-poliéster color azul oscuro. Manga corta con bolsillo frontal y bordado institucional disponible. Costuras reforzadas para uso diario intensivo. Tallas S a XXL.',
 55000.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Pantalón de Dotación Dril Industrial Azul',
 'pantalon-dotacion-dril-industrial-azul',
 'Pantalón industrial de dotación en tela dril de algodón-poliéster de 10 onzas. Color azul con pretina con trabillas, cierre frontal reforzado y bolsillos laterales y traseros. Costuras triples. Tallas 28 a 38.',
 62000.00, 0, 90, true, false,
 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'),

-- ── Botiquín y Primeros Auxilios ──
('c1111111-1111-1111-1111-111111111111',
 'Botiquín de Primeros Auxilios Empresarial Tipo A',
 'botiquin-primeros-auxilios-empresarial-tipo-a',
 'Botiquín empresarial tipo A con dotación completa según resolución 0705. Incluye gasas, vendas, micropore, tijeras, guantes, termómetro, manual de primeros auxilios y más. Caja plástica con cierre hermético.',
 85000.00, 0, 50, true, true,
 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Camilla Rígida de Emergencia en Polietileno',
 'camilla-rigida-emergencia-polietileno',
 'Camilla rígida de emergencia fabricada en polietileno de alta densidad con correas de sujeción de nylon. Soporta hasta 160 kg. Superficie antideslizante y apilable. Incluye inmovilizador de cabeza.',
 320000.00, 0, 20, true, false,
 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&q=80&w=800'),

-- ── Señalización ──
('c1111111-1111-1111-1111-111111111111',
 'Cono de Señalización Vial Naranja 70cm',
 'cono-senalizacion-vial-naranja-70cm',
 'Cono de señalización vial en PVC flexible de alta visibilidad color naranja con franjas reflectivas blancas. Altura 70 cm con base pesada antivuelco. Resistente a impactos y rayos UV.',
 35000.00, 0, 60, true, false,
 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'),

('c1111111-1111-1111-1111-111111111111',
 'Cinta de Señalización Peligro Amarilla 100m',
 'cinta-senalizacion-peligro-amarilla-100m',
 'Cinta de señalización preventiva color amarillo con impresión de "PELIGRO NO PASE" en negro. Rollo de 100 metros de largo x 7.5 cm de ancho. Fabricada en polietileno calibre 2. No adhesiva.',
 8500.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800'),

-- ── Chaleco Reflectivo ──
('c1111111-1111-1111-1111-111111111111',
 'Chaleco Reflectivo Naranja con Bolsillos',
 'chaleco-reflectivo-naranja-bolsillos',
 'Chaleco de seguridad color naranja de alta visibilidad con cintas reflectivas plateadas de 5 cm. Incluye 4 bolsillos frontales con cierre. Tela de malla transpirable. Talla única ajustable con velcro.',
 32000.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?auto=format&fit=crop&q=80&w=800')

ON CONFLICT (slug) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════
-- CATEGORÍA: FERRETERÍA (c2222222-2222-2222-2222-222222222222)
-- Referencia: abastece.co - Ferretería y Mantenimiento
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES

-- ── Lubricantes y Químicos ──
('c2222222-2222-2222-2222-222222222222',
 'Aceite Multiusos 3 en 1 Gotero 90ml',
 'aceite-multiusos-3en1-gotero-90ml',
 'Aceite lubricante multiusos 3 en 1 en presentación gotero de 90 ml. Lubrica, protege y limpia mecanismos metálicos, bisagras, cerraduras y herramientas. Previene la oxidación y reduce la fricción.',
 8500.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Laca en Aerosol Negro Mate 400ml',
 'laca-aerosol-negro-mate-400ml',
 'Pintura en aerosol de acabado negro mate de secado rápido para superficies metálicas, madera y plástico. Resistente a la intemperie y a los rayos UV. Presentación 400 ml con válvula de alta dispersión.',
 15200.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Limpiador de Contactos Electrónicos CRC 430ml',
 'limpiador-contactos-electronicos-crc-430ml',
 'Limpiador y desengrasante en spray para contactos eléctricos y electrónicos marca CRC. Evaporación rápida sin residuos. Seguro para plásticos y cauchos. Ideal para mantenimiento de equipos, tableros y conectores.',
 32000.00, 0, 80, true, true,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Amarres y Sujeción ──
('c2222222-2222-2222-2222-222222222222',
 'Amarre Plástico Blanco 2.5mm x 10cm x 100 Uds',
 'amarre-plastico-blanco-25x10-x100',
 'Paquete de 100 amarres plásticos (bridas/cinchos) de nylon 6.6 color blanco. Medida 2.5 mm x 10 cm. Autobloqueantes con cierre dentado de alta resistencia. Para organización de cables y ductos eléctricos.',
 3800.00, 0, 400, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Amarre Plástico Blanco 3.5mm x 20cm x 100 Uds',
 'amarre-plastico-blanco-35x20-x100',
 'Paquete de 100 amarres plásticos de nylon 6.6 color blanco. Medida 3.5 mm x 20 cm. Alta tensión de cierre para agrupación de cables, tuberías y mangueras. Resistente a temperaturas de -40°C a 85°C.',
 5200.00, 0, 350, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Amarre Plástico Blanco 3.6mm x 15cm x 100 Uds',
 'amarre-plastico-blanco-36x15-x100',
 'Paquete de 100 amarres plásticos de nylon 6.6 color blanco. Medida 3.6 mm x 15 cm. Cierre autobloqueante de precisión. Ideal para instalaciones eléctricas, redes de datos y organización de ductos.',
 4500.00, 0, 380, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Amarre Plástico Negro 3.6mm x 20cm x 100 Uds',
 'amarre-plastico-negro-36x20-x100',
 'Paquete de 100 amarres plásticos de nylon 6.6 color negro con protección UV. Medida 3.6 mm x 20 cm. Mayor resistencia a la intemperie y radiación solar. Para instalaciones exteriores y canalizaciones.',
 5800.00, 0, 300, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Amarre Plástico Blanco 4.8mm x 30cm x 100 Uds',
 'amarre-plastico-blanco-48x30-x100',
 'Paquete de 100 amarres plásticos de nylon 6.6 reforzado color blanco. Medida 4.8 mm x 30 cm. Soporta hasta 22 kg de tensión. Para agrupación de cables gruesos, tuberías y montaje estructural.',
 8900.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Grapas Plásticas para Cable 3/4 x 1 Kilo',
 'grapas-plasticas-cable-34-x1kg',
 'Grapas plásticas de fijación con clavo de acero galvanizado para cables de 3/4 de pulgada. Bolsa de 1 kilogramo (aprox. 450 unidades). Para instalación de cable coaxial, UTP y cables eléctricos en pared.',
 18000.00, 0, 150, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Herramientas Manuales ──
('c2222222-2222-2222-2222-222222222222',
 'Espátula con Mango Plástico 4 Pulgadas - Stanley',
 'espatula-mango-plastico-4-pulgadas-stanley',
 'Espátula profesional de 4 pulgadas marca Stanley con hoja de acero al carbono flexible y mango ergonómico de polipropileno. Ideal para aplicación de masilla, estuco y remoción de pintura vieja.',
 12500.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Flexómetro Cinta Métrica 3 Metros - Stanley',
 'flexometro-cinta-metrica-3m-stanley',
 'Cinta métrica / flexómetro profesional de 3 metros marca Stanley con cinta de acero recubierta en nylon para mayor durabilidad. Carcasa de ABS resistente a impactos con clip para cinturón y freno manual.',
 18500.00, 0, 150, true, true,
 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Destornillador Estrella Phillips #2 x 6" - Stanley',
 'destornillador-estrella-phillips-2x6-stanley',
 'Destornillador de punta Phillips #2 con vástago de 6 pulgadas marca Stanley. Punta con tratamiento de óxido negro para mayor durabilidad y ajuste perfecto. Mango ergonómico bi-material antideslizante.',
 14800.00, 0, 130, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Alicate Universal 8 Pulgadas - Stanley',
 'alicate-universal-8-pulgadas-stanley',
 'Alicate universal de 8 pulgadas marca Stanley con mandíbulas de acero cromo vanadio templado. Zona de corte lateral para cable de acero y cobre. Mango bi-material con aislamiento básico antideslizante.',
 38000.00, 0, 80, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Martillo de Uña 16 oz Mango Fibra de Vidrio',
 'martillo-una-16oz-mango-fibra-vidrio',
 'Martillo de uña de 16 onzas con cabeza de acero forjado pulido y mango de fibra de vidrio con empuñadura de goma antivibración. Uña curva para extracción de clavos. Ideal para carpintería y mantenimiento.',
 42000.00, 0, 70, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Iluminación y Energía ──
('c2222222-2222-2222-2222-222222222222',
 'Bombillo LED Luz Blanca 8W 6500K E27 - Philips',
 'bombillo-led-luz-blanca-8w-6500k-e27-philips',
 'Bombillo LED de 8 vatios equivalente a 60W incandescente marca Philips. Luz blanca fría 6500K, base E27 estándar. Vida útil de 15.000 horas. Bajo consumo energético y encendido instantáneo sin parpadeo.',
 8900.00, 0, 300, true, true,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Bombillo LED Alta Potencia 40W Luz Día 6500K',
 'bombillo-led-alta-potencia-40w-luz-dia-6500k',
 'Bombillo LED de alta potencia de 40 vatios con temperatura de color 6500K (luz día). Base E27/E40. Diseñado para bodegas, talleres y áreas industriales que requieren iluminación intensa. Vida útil 25.000 horas.',
 45000.00, 0, 80, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Linterna LED Recargable de Mano 3W',
 'linterna-led-recargable-mano-3w',
 'Linterna LED portátil de 3 vatios con batería recargable de litio vía USB. Alcance de iluminación de hasta 200 metros. Cuerpo de aluminio resistente a salpicaduras con interruptor de cola táctil.',
 28000.00, 0, 90, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Escaleras ──
('c2222222-2222-2222-2222-222222222222',
 'Escalera Tubular Plegable de Acero 5 Pasos',
 'escalera-tubular-plegable-acero-5-pasos',
 'Escalera plegable de acero tubular de 5 peldaños con capacidad de carga de 150 kg. Peldaños antideslizantes estriados y zapatas de goma de alta fricción. Sistema de bloqueo de seguridad automático.',
 185000.00, 0, 30, true, true,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Escalera de Aluminio Tipo Tijera 6 Pasos',
 'escalera-aluminio-tipo-tijera-6-pasos',
 'Escalera tipo tijera de aluminio liviano de 6 peldaños con bandeja portaherramientas superior. Capacidad de carga 120 kg. Zapatas antideslizantes y tirantes de seguridad. Peso ligero (5.8 kg) para fácil transporte.',
 245000.00, 0, 25, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Abrasivos y Adhesivos ──
('c2222222-2222-2222-2222-222222222222',
 'Lija de Agua N° 150 Hoja 23x28cm',
 'lija-agua-no150-hoja-23x28cm',
 'Lija de agua grano 150 para acabado medio en superficies de madera, metal, masilla y estuco. Hoja de 23x28 cm con respaldo de papel impermeable. Puede usarse en seco o en húmedo para mejor acabado.',
 2500.00, 0, 500, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Lija de Agua N° 180 Hoja 23x28cm',
 'lija-agua-no180-hoja-23x28cm',
 'Lija de agua grano 180 para acabado fino en superficies preparadas para pintura. Hoja de 23x28 cm con óxido de aluminio y respaldo impermeable. Ideal para lijado entre capas de pintura y barniz.',
 2500.00, 0, 500, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Ganchos Adhesivos Reutilizables Transparentes x 4 Uds',
 'ganchos-adhesivos-reutilizables-transparentes-x4',
 'Set de 4 ganchos adhesivos transparentes reutilizables para paredes lisas. Capacidad de carga de 2 kg por gancho. No dejan residuos ni dañan la superficie. Ideales para oficinas, baños y cocinas.',
 8500.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

-- ── Cintas y Selladores ──
('c2222222-2222-2222-2222-222222222222',
 'Cinta Aislante Eléctrica Negra 3/4" x 20m',
 'cinta-aislante-electrica-negra-34x20m',
 'Cinta aislante eléctrica de PVC color negro de 3/4 de pulgada por 20 metros. Resistente a 600V y temperaturas de hasta 80°C. Adhesivo de caucho natural de alta adherencia para aislamiento eléctrico profesional.',
 4500.00, 0, 350, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Silicona Selladora Transparente Tubo 280ml',
 'silicona-selladora-transparente-tubo-280ml',
 'Sellador de silicona transparente multiusos en tubo de 280 ml para pistola calafateadora. Flexible, impermeable y resistente a hongos. Ideal para sellado de ventanas, baños, cocinas y juntas de dilatación.',
 12000.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800'),

('c2222222-2222-2222-2222-222222222222',
 'Teflón Rollo 3/4" x 10m para Tubería',
 'teflon-rollo-34x10m-tuberia',
 'Cinta de teflón (PTFE) de 3/4 de pulgada por 10 metros para sellado de roscas en tuberías de agua, gas y aire comprimido. Alta densidad y espesor uniforme. Resistente a presiones de hasta 15 bar.',
 3200.00, 0, 400, true, false,
 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800')

ON CONFLICT (slug) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════
-- CATEGORÍA: PAPELERÍA (c3333333-3333-3333-3333-333333333333)
-- Referencia: abastece.co - Papelería y Suministros de Oficina
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO products (category_id, name, slug, description, price, discount, stock, active, featured, main_image_url) VALUES

-- ── Papel y Resmas ──
('c3333333-3333-3333-3333-333333333333',
 'Resma de Papel Bond Carta 75g Reprograf x 500 Hojas',
 'resma-papel-bond-carta-75g-reprograf-x500',
 'Resma de 500 hojas de papel bond blanco tamaño carta (21.6 x 27.9 cm) de 75 g/m². Marca Reprograf, fabricado con fibra de caña de azúcar. Alta blancura (ISO 96%), libre de atascos en impresoras láser e inyección.',
 15800.00, 0, 300, true, true,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Resma de Papel Bond Oficio 75g x 500 Hojas',
 'resma-papel-bond-oficio-75g-x500',
 'Resma de 500 hojas de papel bond blanco tamaño oficio (21.6 x 33 cm) de 75 g/m². Ideal para documentos legales, contratos e impresión masiva corporativa. Compatible con fotocopiadoras de alto volumen.',
 18500.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Resma de Papel Bond Carta 80g Premium x 500 Hojas',
 'resma-papel-bond-carta-80g-premium-x500',
 'Resma premium de 500 hojas de papel bond blanco tamaño carta de 80 g/m². Mayor gramaje para presentaciones profesionales, cotizaciones y documentos de calidad superior. Libre de ácidos para mayor durabilidad.',
 19200.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Cuadernos y Libretas ──
('c3333333-3333-3333-3333-333333333333',
 'Agenda Ejecutiva 2026 Tamaño A5 Cuero Sintético',
 'agenda-ejecutiva-2026-a5-cuero-sintetico',
 'Agenda ejecutiva para el año 2026 en formato diario con tapa dura de cuero sintético. Tamaño A5 con 384 páginas de papel marfil de 80 g/m². Incluye cinta separadora, bolsillo interior y elástico de cierre.',
 42000.00, 0, 80, true, true,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Libreta Argollada Tamaño Carta 100 Hojas Cuadriculada',
 'libreta-argollada-carta-100-hojas-cuadriculada',
 'Libreta argollada profesional tamaño carta (21.6 x 27.9 cm) con 100 hojas cuadriculadas de 56 g/m². Argolla metálica doble O de 1 pulgada. Tapa y contratapa en cartulina plastificada. Perforada para archivar.',
 9800.00, 0, 150, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Escritura ──
('c3333333-3333-3333-3333-333333333333',
 'Esfero Bolígrafo Negro Punta Media x 12 Uds - Kilométrico',
 'esfero-boligrafo-negro-punta-media-x12-kilometrico',
 'Caja de 12 bolígrafos marca Kilométrico con tinta negra y punta media de 1.0 mm. Cuerpo hexagonal transparente con tapa ventilada. Escritura suave y continua de hasta 1 km de trazo por unidad.',
 12000.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Esfero Bolígrafo Azul Punta Media x 12 Uds - Kilométrico',
 'esfero-boligrafo-azul-punta-media-x12-kilometrico',
 'Caja de 12 bolígrafos marca Kilométrico con tinta azul y punta media de 1.0 mm. Cuerpo hexagonal transparente con tapa ventilada de seguridad. Escritura uniforme para uso diario en oficinas.',
 12000.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Lápiz Grafito N°2 HB x 12 Uds - Faber-Castell',
 'lapiz-grafito-no2-hb-x12-faber-castell',
 'Caja de 12 lápices de grafito N°2 HB marca Faber-Castell con cuerpo hexagonal de madera reforestada y mina centrada para sacapuntas uniforme. Ideales para escritura, dibujo técnico y exámenes.',
 14500.00, 0, 180, true, false,
 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Marcador para Tablero Negro Punta Redonda x 4 Uds',
 'marcador-tablero-negro-punta-redonda-x4',
 'Set de 4 marcadores para tablero acrílico de tinta negra borrables en seco. Punta redonda de 2 mm para trazo limpio y definido. Tinta no tóxica de larga duración con cuerpo cilíndrico ergonómico.',
 18000.00, 0, 130, true, false,
 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Resaltador Fluorescente Amarillo x 6 Uds',
 'resaltador-fluorescente-amarillo-x6',
 'Set de 6 resaltadores fluorescentes color amarillo con punta biselada de 4 mm. Tinta a base de agua que no traspasa el papel. Cuerpo ventilado de seguridad. Ideales para estudio y oficina.',
 15000.00, 0, 160, true, false,
 'https://images.unsplash.com/photo-1585336261026-8f5786372966?auto=format&fit=crop&q=80&w=800'),

-- ── Organización y Archivo ──
('c3333333-3333-3333-3333-333333333333',
 'Carpeta AZ Tamaño Oficio Lomo 8cm',
 'carpeta-az-tamano-oficio-lomo-8cm',
 'Carpeta archivadora AZ tamaño oficio con lomo de 8 cm y mecanismo palanca de metal niquelado. Tapas de cartón rígido prensado con acabado marmoleado. Herraje metálico con compresor. Para archivo pesado.',
 12500.00, 0, 200, true, true,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Sobre de Manila Carta x 100 Uds',
 'sobre-manila-carta-x100',
 'Paquete de 100 sobres de manila (kraft) tamaño carta (22.9 x 30.5 cm) de 90 g/m². Solapa engomada con cierre por presión. Ideales para correspondencia, documentos legales y distribución interna.',
 22000.00, 0, 180, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Carpeta Colgante Tamaño Oficio x 25 Uds',
 'carpeta-colgante-tamano-oficio-x25',
 'Caja de 25 carpetas colgantes tamaño oficio con ganchos metálicos ajustables y pestaña plástica con jinete para identificación. Cartulina kraft de 220 g/m². Compatible con archivadores y gaveteros estándar.',
 35000.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Caja para Archivo X-200 Carta',
 'caja-archivo-x200-carta',
 'Caja de archivo inactivo X-200 tamaño carta en cartón corrugado resistente de doble pared. Medida 38 x 25 x 27 cm. Tapa con solapas autoensamblables. Capacidad para 6 carpetas AZ o 12 carpetas colgantes.',
 8500.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Separadores Plásticos Tamaño Carta x 10 Pestañas',
 'separadores-plasticos-carta-x10-pestanas',
 'Juego de 10 separadores de archivo en polipropileno de colores surtidos con pestañas impresas del 1 al 10. Tamaño carta con perforación universal de 3 huecos. Resistentes al uso continuo.',
 6800.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Adhesivos y Banderitas ──
('c3333333-3333-3333-3333-333333333333',
 'Banderitas Adhesivas Post-it Flecha x 5 Colores',
 'banderitas-adhesivas-postit-flecha-x5-colores',
 'Paquete de banderitas adhesivas señalizadoras tipo flecha Post-it en 5 colores brillantes (25 por color = 125 unidades). Reposicionables y removibles sin residuos. Ideales para marcar documentos y estudiar.',
 12500.00, 0, 180, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Notas Adhesivas Post-it Amarillo 3x3" x 100 Hojas',
 'notas-adhesivas-postit-amarillo-3x3-x100',
 'Block de 100 notas adhesivas Post-it de 7.6 x 7.6 cm (3x3 pulgadas) color amarillo clásico. Adhesivo repositionable que no daña las superficies. Para recordatorios, mensajes y organización de tareas en oficina.',
 5500.00, 0, 300, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Accesorios de Escritorio ──
('c3333333-3333-3333-3333-333333333333',
 'Cosedora / Grapadora Estándar 20 Hojas Metálica',
 'cosedora-grapadora-estandar-20-hojas-metalica',
 'Cosedora (grapadora) metálica de escritorio con capacidad de engrapado de hasta 20 hojas. Utiliza grapas estándar 26/6. Base antideslizante y mecanismo de presión ergonómico. Acabado niquelado resistente.',
 18000.00, 0, 100, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Grapas Estándar 26/6 x 5000 Uds',
 'grapas-estandar-26-6-x5000',
 'Caja de 5.000 grapas estándar 26/6 de alambre galvanizado de alta resistencia. Compatibles con grapadoras/cosedoras estándar de escritorio. Punta afilada para penetración limpia sin esfuerzo.',
 4800.00, 0, 350, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Tijeras de Oficina 8 Pulgadas Mango Ergonómico',
 'tijeras-oficina-8-pulgadas-mango-ergonomico',
 'Tijeras de oficina de 8 pulgadas (21 cm) con hojas de acero inoxidable y mango ergonómico de polipropileno apto para diestros y zurdos. Corte preciso y suave para papel, cartulina y cinta adhesiva.',
 9500.00, 0, 150, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Bisturí Cortador Retráctil de 18mm',
 'bisturi-cortador-retractil-18mm',
 'Bisturí / cortador con cuchilla retráctil de 18 mm y guía de corte segmentable en acero al carbono. Cuerpo de plástico ABS con seguro deslizable. Ideal para corte de cartón, papel, vinilo y empaques.',
 5200.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Sacapuntas Metálico Doble Orificio x 12 Uds',
 'sacapuntas-metalico-doble-orificio-x12',
 'Set de 12 sacapuntas metálicos de aluminio con doble orificio para lápices estándar y jumbo. Cuchilla de acero templado de alto filo para punta precisa y uniforme. Compacto y duradero.',
 8500.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Borrador de Nata Blanco x 20 Uds - Pelikan',
 'borrador-nata-blanco-x20-pelikan',
 'Caja de 20 borradores de nata blanca marca Pelikan. Borrado limpio sin manchas ni residuos de tinta. Textura suave que no daña el papel. Tamaño estándar con funda de cartón protectora.',
 15000.00, 0, 200, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Escritorio y Organización ──
('c3333333-3333-3333-3333-333333333333',
 'Bandeja Portadocumentos Apilable de Malla Metálica',
 'bandeja-portadocumentos-apilable-malla-metalica',
 'Bandeja de escritorio para documentos tamaño carta fabricada en malla de acero con recubrimiento epoxi negro. Diseño apilable hasta 6 niveles. Base antideslizante. Organización profesional de escritorio.',
 22000.00, 0, 80, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Papelera de Malla Metálica Negra para Escritorio',
 'papelera-malla-metalica-negra-escritorio',
 'Papelera de escritorio cilíndrica fabricada en malla de acero con acabado negro mate. Capacidad 12 litros. Base reforzada con borde enrollado para resistencia. Diseño elegante para oficinas modernas.',
 18000.00, 0, 90, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Cintas Adhesivas ──
('c3333333-3333-3333-3333-333333333333',
 'Cinta Pegante Transparente 12mm x 40m x 12 Rollos',
 'cinta-pegante-transparente-12mmx40m-x12',
 'Paquete de 12 rollos de cinta adhesiva transparente de 12 mm x 40 metros cada uno. Adhesivo acrílico de alta adherencia y resistencia al envejecimiento. Para oficinas, empaque ligero y manualidades.',
 18500.00, 0, 180, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Cinta de Enmascarar 24mm x 40m x 6 Rollos',
 'cinta-enmascarar-24mmx40m-x6',
 'Paquete de 6 rollos de cinta de enmascarar (masking tape) de 24 mm x 40 metros. Adhesivo de caucho removible sin residuos. Ideal para pintura, rotulación temporal, embalaje y manualidades.',
 22000.00, 0, 140, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Pegantes ──
('c3333333-3333-3333-3333-333333333333',
 'Pegante en Barra 40g x 6 Uds - Pritt',
 'pegante-barra-40g-x6-pritt',
 'Paquete de 6 barras de pegamento en barra de 40 gramos marca Pritt. Fórmula sin solventes, lavable y no tóxica. Aplicación suave y uniforme sin arrugas en papel, cartulina y fotografías.',
 28000.00, 0, 150, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Bandas de Caucho Bolsa x 100g',
 'bandas-caucho-bolsa-x100g',
 'Bolsa de bandas de caucho (ligas elásticas) de 100 gramos en tamaño surtido. Caucho natural de alta elasticidad y resistencia a la rotura. Para agrupación de documentos, billetes y paquetes.',
 4500.00, 0, 250, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

('c3333333-3333-3333-3333-333333333333',
 'Almohadilla Dactilar Tinta Azul para Huella',
 'almohadilla-dactilar-tinta-azul-huella',
 'Almohadilla dactilar entintada en color azul para toma de huellas y firmas en documentos oficiales. Base metálica con felpa de alta retención de tinta. Tinta indeleble que no se borra con agua.',
 8500.00, 0, 120, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800'),

-- ── Acetatos y Especiales ──
('c3333333-3333-3333-3333-333333333333',
 'Acetatos Transparentes Tamaño Carta x 100 Hojas',
 'acetatos-transparentes-carta-x100',
 'Caja de 100 hojas de acetato transparente tamaño carta (21.6 x 27.9 cm) para retroproyector e impresora láser. Calibre 3.5 de alta nitidez óptica. Para presentaciones, separadores y manualidades profesionales.',
 38000.00, 0, 60, true, false,
 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800')

ON CONFLICT (slug) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════
-- RESUMEN DEL SEED:
-- ═══════════════════════════════════════════════════════════════════════
-- Aseo:        25 productos
-- Dotación:    22 productos
-- Ferretería:  25 productos
-- Papelería:   30 productos
-- ─────────────────────────────────────────
-- TOTAL:       102 productos nuevos
-- ═══════════════════════════════════════════════════════════════════════
