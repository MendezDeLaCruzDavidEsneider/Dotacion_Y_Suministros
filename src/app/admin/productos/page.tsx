import React from 'react';
import { getProducts } from '@/services/products.service';
import { getCategories } from '@/services/categories.service';
import { ProductTableClient } from '@/components/admin/ProductTableClient';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ProductTableClient initialProducts={products} categories={categories} />;
}
