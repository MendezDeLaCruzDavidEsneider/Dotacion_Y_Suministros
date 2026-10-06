import React from 'react';
import { notFound } from 'next/navigation';
import { getCategories } from '@/services/categories.service';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/admin/ProductForm';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/services/mockData';

export const revalidate = 0;

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm categories={categories} initialData={product} isEdit={true} />;
}

async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();

    if (!error && data) {
      return data as Product;
    }
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.id === id) || null;
  }
}
