"use server";

import { createClient } from "@supabase/supabase-js";

// Create a Supabase client for admin operations using the service role key
// This client bypasses RLS and should only be used on the server.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL or Service Role Key is missing from environment variables.');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for category creation (matches the form schema but for server-side validation)
const CategoryActionSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
});

export type CategoryActionState = {
  message?: string;
  error?: string;
  fields?: Record<string, string>;
};

export async function createCategory(
  values: z.infer<typeof CategoryActionSchema>
): Promise<CategoryActionState> {
  const validatedFields = CategoryActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    const { error } = await supabaseAdmin
      .from("categories")
      .insert([{ name, description: description || null }])
      .select(); // .select() can be useful if you want to return the created object

    if (error) {
      console.error("Supabase error creating category:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/categories"); // Revalidate the categories list page
    revalidatePath("/admin/categories/new"); // Revalidate the new category page (less critical here but good practice)
    
    return { message: `Category "${name}" created successfully.` };

  } catch (e: any) {
    console.error("Failed to create category:", e);
    return { error: "An unexpected error occurred." };
  }
}

export async function updateCategory(
  id: string,
  values: z.infer<typeof CategoryActionSchema>
): Promise<CategoryActionState> {
  if (!id) {
    return { error: "Category ID is missing." };
  }

  const validatedFields = CategoryActionSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields.",
      fields: validatedFields.error.flatten().fieldErrors as Record<string, string>,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    const { error } = await supabaseAdmin
      .from("categories")
      .update({ name, description: description || null })
      .eq("id", id)
      .select(); // .select() can be useful if you want to return the updated object

    if (error) {
      console.error("Supabase error updating category:", error);
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/categories"); // Revalidate the categories list page
    revalidatePath(`/admin/categories/edit/${id}`); // Revalidate the current edit page
    
    return { message: `Category "${name}" updated successfully.` };

  } catch (e: any) {
    console.error("Failed to update category:", e);
    return { error: "An unexpected error occurred while updating." };
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  if (!id) {
    return { error: "Category ID is missing for deletion." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase error deleting category:", error);
      // Check for foreign key violation (e.g., if products are linked to this category)
      if (error.code === '23503') { // PostgreSQL foreign key violation code
        return { error: "Database Error: This category cannot be deleted because it is linked to existing products." };
      }
      return { error: `Database Error: ${error.message}` };
    }

    revalidatePath("/admin/categories"); // Revalidate the categories list page
    return { message: "Category deleted successfully." };

  } catch (e: any) {
    console.error("Failed to delete category:", e);
    return { error: "An unexpected error occurred while deleting." };
  }
}
