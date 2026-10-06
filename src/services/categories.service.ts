import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types';
import { MOCK_CATEGORIES } from './mockData';

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }

    return data as Category[];
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error || !data) {
      return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
    }

    return data as Category;
  } catch {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) || null;
  }
}
