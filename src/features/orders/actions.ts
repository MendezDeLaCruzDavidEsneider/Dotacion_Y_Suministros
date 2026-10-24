'use server';

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { CreateOrderInput } from '@/types';
import { z } from 'zod';
import { MOCK_PRODUCTS } from '@/services/mockData';

const isPostgresUUID = (id: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

const checkoutSchema = z.object({
  customer_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  company_name: z.string().min(2, 'El nombre de la empresa/entidad es requerido'),
  email: z.string().email('Ingrese un correo electrónico válido'),
  phone: z.string().min(7, 'Ingrese un teléfono de contacto válido'),
  address: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string().min(1, 'ID de producto inválido'),
      quantity: z.number().int().positive('La cantidad debe ser mayor a cero'),
    })
  ).min(1, 'El pedido debe contener al menos un producto'),
});

export async function createOrderAction(input: CreateOrderInput) {
  try {
    // 1. Validar la estructura del formulario con Zod
    const validatedData = checkoutSchema.parse(input);

    const supabase = await createClient();
    const productIds = validatedData.items.map((i) => i.product_id);
    const validDbIds = productIds.filter(isPostgresUUID);

    // 2. Consultar PRECIOS REALES directamente en la base de datos (NUNCA confiar en precios del cliente)
    let realProducts: { id: string; name: string; price: number; active: boolean; stock: number; discount?: number }[] = [];

    if (validDbIds.length > 0) {
      const { data: dbProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, name, price, active, stock, discount')
        .in('id', validDbIds);

      if (!fetchError && dbProducts && dbProducts.length > 0) {
        realProducts = dbProducts as typeof realProducts;
      } else {
        // Si la consulta falló por columna discount inexistente, reintentar sin discount
        const { data: fallbackProds } = await supabase
          .from('products')
          .select('id, name, price, active, stock')
          .in('id', validDbIds);

        if (fallbackProds && fallbackProds.length > 0) {
          realProducts = fallbackProds as typeof realProducts;
        }
      }
    }

    // Complementar con MOCK_PRODUCTS para cualquier producto que no esté en la DB
    const missingIds = productIds.filter((id) => !realProducts.some((p) => p.id === id));
    if (missingIds.length > 0) {
      const mockMatches = MOCK_PRODUCTS.filter((p) => missingIds.includes(p.id));
      realProducts = [...realProducts, ...mockMatches];
    }

    if (realProducts.length === 0) {
      return { success: false, error: 'No se encontraron los productos seleccionados en el catálogo.' };
    }

    // 3. Recalcular subtotales con descuentos aplicados y verificar existencias
    let calculatedSubtotal = 0;
    const verifiedOrderItems: {
      product_id: string;
      product_name: string;
      quantity: number;
      unit_price: number;
      subtotal: number;
    }[] = [];

    for (const item of validatedData.items) {
      const dbProd = realProducts.find((p) => p.id === item.product_id);
      if (!dbProd || !dbProd.active) {
        return {
          success: false,
          error: `El producto "${dbProd?.name || item.product_id}" no está disponible actualmente.`,
        };
      }

      const hasDiscount = dbProd.discount !== undefined && Number(dbProd.discount) > 0;
      const unitPrice = hasDiscount
        ? Number(dbProd.price) * (1 - Number(dbProd.discount) / 100)
        : Number(dbProd.price);

      const itemSubtotal = unitPrice * item.quantity;
      calculatedSubtotal += itemSubtotal;

      verifiedOrderItems.push({
        product_id: dbProd.id,
        product_name: dbProd.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: itemSubtotal,
      });
    }

    const calculatedTotal = calculatedSubtotal;
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `PED-2026-${randomSeq}`;

    // 4. Insertar la orden principal en Supabase
    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: validatedData.customer_name,
        company_name: validatedData.company_name,
        email: validatedData.email.toLowerCase().trim(),
        phone: validatedData.phone,
        address: validatedData.address || null,
        notes: validatedData.notes || null,
        subtotal: calculatedSubtotal,
        total: calculatedTotal,
        status: 'PENDIENTE',
      })
      .select('id, order_number')
      .single();

    if (orderError) {
      console.error('[createOrderAction DB Order Error]:', orderError);
      return {
        success: false,
        error: `Error al registrar el pedido en la base de datos: ${orderError.message}. Asegúrate de ejecutar la migración SQL en Supabase para habilitar las políticas de pedidos.`,
      };
    }

    if (!insertedOrder) {
      return {
        success: false,
        error: 'No se recibió confirmación de guardado desde la base de datos.',
      };
    }

    // 5. Insertar los items del detalle del pedido
    const itemsToInsert = verifiedOrderItems.map((item) => ({
      order_id: insertedOrder.id,
      product_id: isPostgresUUID(item.product_id) ? item.product_id : null,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
    if (itemsError) {
      console.error('[createOrderAction Items Insert Error]:', itemsError);
    }

    return {
      success: true,
      orderNumber: insertedOrder.order_number,
      orderId: insertedOrder.id,
      message: 'Solicitud de cotización y pedido guardada exitosamente en la base de datos.',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || 'Datos del formulario de pedido inválidos.',
      };
    }
    return {
      success: false,
      error: 'Ocurrió un error al procesar el pedido. Por favor intente de nuevo.',
    };
  }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    if (!orderId || !status) {
      return { success: false, error: 'ID de pedido y estado requeridos.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('[updateOrderStatusAction Error]:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/pedidos');
    revalidatePath('/admin/dashboard');
    revalidatePath('/historial-servicios');

    return { success: true };
  } catch (err: any) {
    console.error('[updateOrderStatusAction Exception]:', err);
    return { success: false, error: err.message || 'Error inesperado al actualizar estado.' };
  }
}
