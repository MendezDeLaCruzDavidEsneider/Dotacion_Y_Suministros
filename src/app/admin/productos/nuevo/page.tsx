import React from 'react';
import { getCategories } from '@/services/categories.service';
import { ProductForm } from '@/components/admin/ProductForm';

export const revalidate = 0;

export default async function NewProductPage() {
  const categories = await getCategories();

  return <ProductForm categories={categories} isEdit={false} />;
}
