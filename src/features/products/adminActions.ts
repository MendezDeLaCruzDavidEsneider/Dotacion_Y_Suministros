'use server';

import { createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ProductFormData {
  name: string;
  category_id: string;
  price: number;
  stock: number;
  description: string;
  main_image_url?: string;
  featured?: boolean;
  active?: boolean;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function createProductAction(data: ProductFormData) {
  try {
    if (!data.name?.trim()) return { success: false, error: 'El nombre del producto es obligatorio.' };
    if (!data.category_id) return { success: false, error: 'Debe seleccionar una categoría.' };
    if (data.price === undefined || data.price < 0) return { success: false, error: 'El precio debe ser mayor o igual a 0.' };
    if (data.stock === undefined || data.stock < 0) return { success: false, error: 'El stock debe ser mayor o igual a 0.' };

    const baseSlug = slugify(data.name);
    const uniqueSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

    const supabase = createAdminClient();

    const { data: newProd, error } = await supabase
      .from('products')
      .insert({
        name: data.name.trim(),
        slug: uniqueSlug,
        category_id: data.category_id,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.description?.trim() || '',
        main_image_url: data.main_image_url?.trim() || null,
        featured: data.featured ?? false,
        active: data.active ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error insertando producto:', error);
      return { success: false, error: error.message || 'Error al guardar el producto en la base de datos.' };
    }

    revalidatePath('/');
    revalidatePath('/productos');
    revalidatePath('/admin/productos');
    revalidatePath('/admin/dashboard');

    return { success: true, data: newProd };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error inesperado al crear el producto.' };
  }
}

export async function updateProductAction(id: string, data: ProductFormData) {
  try {
    if (!id) return { success: false, error: 'ID de producto no proporcionado.' };
    if (!data.name?.trim()) return { success: false, error: 'El nombre del producto es obligatorio.' };
    if (!data.category_id) return { success: false, error: 'Debe seleccionar una categoría.' };

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('products')
      .update({
        name: data.name.trim(),
        category_id: data.category_id,
        price: Number(data.price),
        stock: Number(data.stock),
        description: data.description?.trim() || '',
        main_image_url: data.main_image_url?.trim() || null,
        featured: data.featured ?? false,
        active: data.active ?? true,
      })
      .eq('id', id);

    if (error) {
      console.error('Error actualizando producto:', error);
      return { success: false, error: error.message || 'Error al actualizar el producto.' };
    }

    revalidatePath('/');
    revalidatePath('/productos');
    revalidatePath('/admin/productos');
    revalidatePath(`/admin/productos/${id}`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error inesperado al actualizar el producto.' };
  }
}

export async function deleteProductAction(id: string) {
  try {
    if (!id) return { success: false, error: 'ID no proporcionado.' };

    const supabase = createAdminClient();

    // Eliminar características e imágenes asociadas primero
    await supabase.from('product_features').delete().eq('product_id', id);
    await supabase.from('product_images').delete().eq('product_id', id);

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error eliminando producto:', error);
      return { success: false, error: error.message || 'Error al eliminar el producto.' };
    }

    revalidatePath('/');
    revalidatePath('/productos');
    revalidatePath('/admin/productos');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error inesperado al eliminar el producto.' };
  }
}
