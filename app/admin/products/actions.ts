"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Supabase admin client (uses service_role key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing from environment variables for product actions.');
}
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Schema for product creation/update
const ProductActionSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters.").max(255),
  description: z.string().max(1000, "Description must not exceed 1000 characters.").optional(),
  price: z.coerce.number().positive("Price must be a positive number."),
  stock_quantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative."),
  category_id: z.string().uuid("A valid category must be selected."),
  image_url: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')), 
  sizes: z.array(z.string()).optional(), // Array of selected sizes
});

export type ProductActionState = {
  message?: string;
  error?: string;
  fields?: Record<string, string>; // For field-specific errors
};

// --- CREATE PRODUCT --- 
export async function createProduct(
  values: z.infer<typeof ProductActionSchema>
): Promise<ProductActionState> {
  const validatedFields = ProductActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields for product.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  const dataToInsert = {
    ...validatedFields.data,
    sizes: validatedFields.data.sizes || [], // Ensure sizes is at least an empty array
  };

  try {
    const { error } = await supabaseAdmin
      .from("products")
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error("Supabase error creating product:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/products");
    return { message: `Product "${dataToInsert.name}" created successfully.` };

  } catch (e: any) {
    console.error("Failed to create product:", e);
    return { error: "An unexpected error occurred while creating the product." };
  }
}

// --- UPDATE PRODUCT --- 
export async function updateProduct(
  id: string,
  values: z.infer<typeof ProductActionSchema>
): Promise<ProductActionState> {
  if (!id) return { error: "Product ID is missing." };

  const validatedFields = ProductActionSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid fields for product update.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  const dataToUpdate = {
    ...validatedFields.data,
    sizes: validatedFields.data.sizes || [], // Ensure sizes is at least an empty array
  };

  try {
    const { error } = await supabaseAdmin
      .from("products")
      .update(dataToUpdate)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Supabase error updating product:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/edit/${id}`);
    return { message: `Product "${dataToUpdate.name}" updated successfully.` };

  } catch (e: any) {
    console.error("Failed to update product:", e);
    return { error: "An unexpected error occurred while updating the product." };
  }
}

// --- DELETE PRODUCT --- 
export async function deleteProduct(id: string): Promise<ProductActionState> {
  if (!id) return { error: "Product ID is missing for deletion." };

  try {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting product:", error);
      // Note: Foreign key constraints (e.g., on product_variants if they referenced this product) might cause errors.
      // The current 'ON DELETE RESTRICT' on 'products.category_id' won't be an issue here, but if products were an FK for something else.
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/products");
    return { message: "Product deleted successfully." };

  } catch (e: any) {
    console.error("Failed to delete product:", e);
    return { error: "An unexpected error occurred while deleting the product." };
  }
}
