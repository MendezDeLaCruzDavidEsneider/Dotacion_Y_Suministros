import { createClient } from '@/lib/supabase/server';
import { Product, ProductFilterOptions } from '@/types';
import { MOCK_PRODUCTS } from './mockData';

export async function getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
  const { categorySlug, searchQuery, featuredOnly, minPrice, maxPrice, sortBy = 'newest' } = options;

  try {
    const supabase = await createClient();

    let categoryId: string | null = null;
    if (categorySlug) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (categoryData) {
        categoryId = categoryData.id;
      }
    }

    // Traer productos en lotes de 1000 para superar el límite por defecto de PostgREST
    let allProducts: Product[] = [];
    let from = 0;
    const batchSize = 1000;
    let hasMore = true;

    while (hasMore) {
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('active', true)
        .range(from, from + batchSize - 1);

      if (featuredOnly) {
        query = query.eq('featured', true);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (searchQuery && searchQuery.trim() !== '') {
        query = query.ilike('name', `%${searchQuery.trim()}%`);
      }

      if (minPrice !== undefined) {
        query = query.gte('price', minPrice);
      }

      if (maxPrice !== undefined) {
        query = query.lte('price', maxPrice);
      }

      // Ordenamiento
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'name-asc':
          query = query.order('name', { ascending: true });
          break;
        case 'name-desc':
          query = query.order('name', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        hasMore = false;
      } else {
        allProducts.push(...(data as Product[]));
        from += batchSize;
        if (data.length < batchSize) {
          hasMore = false;
        }
      }
    }

    if (allProducts.length === 0) {
      return filterMockProducts(options);
    }

    return allProducts;
  } catch {
    return filterMockProducts(options);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), product_features(*), product_images(*)')
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error || !data) {
      return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
    }

    return data as Product;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
}

export async function getRelatedProducts(categoryId: string, currentProductId: string, limit = 4): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('category_id', categoryId)
      .eq('active', true)
      .neq('id', currentProductId)
      .limit(limit);

    if (error || !data || data.length === 0) {
      return MOCK_PRODUCTS.filter(
        (p) => p.category_id === categoryId && p.id !== currentProductId
      ).slice(0, limit);
    }

    return data as Product[];
  } catch {
    return MOCK_PRODUCTS.filter(
      (p) => p.category_id === categoryId && p.id !== currentProductId
    ).slice(0, limit);
  }
}

function filterMockProducts(options: ProductFilterOptions): Product[] {
  const { categorySlug, searchQuery, featuredOnly, minPrice, maxPrice, sortBy = 'newest' } = options;

  let result = [...MOCK_PRODUCTS].filter((p) => p.active);

  if (featuredOnly) {
    result = result.filter((p) => p.featured);
  }

  if (categorySlug) {
    result = result.filter((p) => p.category?.slug === categorySlug);
  }

  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  if (minPrice !== undefined) {
    result = result.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    result = result.filter((p) => p.price <= maxPrice);
  }

  switch (sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(a.name));
      break;
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
    default:
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
  }

  return result;
}
