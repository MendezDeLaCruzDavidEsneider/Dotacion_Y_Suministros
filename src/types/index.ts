export * from './database';

export interface CartItem {
  product: import('./database').Product;
  quantity: number;
}

export interface CreateOrderInput {
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface ProductFilterOptions {
  categoryId?: string;
  categorySlug?: string;
  searchQuery?: string;
  featuredOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';
}
