export type UserRole = 'ADMIN' | 'USER';

export type OrderStatus =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'ENVIADO'
  | 'COMPLETADO'
  | 'CANCELADO';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount?: number; // porcentaje de descuento (0-100)
  stock: number;
  active: boolean;
  featured: boolean;
  main_image_url: string | null;
  created_at: string;
  updated_at: string;
  // Campos opcionales por relaciones JOIN
  category?: Category;
  product_features?: ProductFeature[];
  product_images?: ProductImage[];
}

export interface ProductFeature {
  id: string;
  product_id: string;
  name: string;
  value: string;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  address: string | null;
  notes: string | null;
  subtotal: number;
  total: number;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}
