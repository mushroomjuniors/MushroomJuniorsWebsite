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
  image_url: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  gender: z.enum(["boys", "girls", "unisex"]).default("unisex"),
});

export type CategoryActionState = {
  message?: string;
  error?: string;
  fields?: Record<string, string>;
};

// Helper function to generate a slug from a name
function generateSlug(name: string): string {
  // Convert to lowercase and remove accents
  let slug = name.toLowerCase();
  
  // Handle fractions like 3/4 - keep numbers together
  slug = slug.replace(/(\d+)\/(\d+)/g, '$1$2');
  
  // Replace apostrophes and special chars with nothing (remove them)
  slug = slug.replace(/['']/g, '');
  
  // Replace spaces and other non-alphanumeric chars with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
}

export async function createCategory(prevState: CategoryActionState, formData: FormData): Promise<CategoryActionState> {
  // Let's destructure and prepare the data we need
  const name = formData.get('name')?.toString().trim() || '';
  const description = formData.get('description')?.toString().trim() || '';
  const image_url = formData.get('image_url')?.toString().trim() || '';
  const gender = (formData.get('gender')?.toString() as "boys" | "girls" | "unisex") || 'unisex';

  // Validate the data on the server-side
  try {
    const validatedData = CategoryActionSchema.parse({
      name,
      description: description || undefined, // zod handles empty strings differently
      image_url: image_url || undefined, // zod handles empty strings differently
      gender,
    });

    // Generate slug from name
    const slug = generateSlug(name);

    // Perform the insert operation
    const { data, error } = await supabaseAdmin.from('categories').insert([
      { 
        name: validatedData.name, 
        description: validatedData.description || null, 
        image_url: validatedData.image_url || null,
        gender: validatedData.gender,
        slug: slug 
      }
    ]).select().single();

    if (error) {
      console.error("Error creating category:", error);
      return {
        message: "",
        error: `Failed to create category: ${error.message}`,
      };
    }

    revalidatePath('/admin/categories');
    return {
      message: `Category "${validatedData.name}" created successfully!`,
      error: "",
    };
  } catch (error: any) {
    // Catch and handle validation errors
    console.error("Category validation error:", error);
    return {
      message: "",
      error: `Failed to create category: ${error?.message || "Unknown error"}`,
    };
  }
}

export async function updateCategory(
  id: string,
  data: { name: string; description?: string; image_url?: string; gender?: "boys" | "girls" | "unisex" }
): Promise<CategoryActionState> {
  const name = data.name?.toString().trim() || '';
  const description = data.description?.toString().trim() || '';
  const image_url = data.image_url?.toString().trim() || '';
  const gender = (data.gender as "boys" | "girls" | "unisex") || 'unisex';

  try {
    const validatedData = CategoryActionSchema.parse({
      name,
      description: description || undefined,
      image_url: image_url || undefined,
      gender,
    });

    // Generate slug from name
    const slug = generateSlug(name);

    const { data: updatedData, error } = await supabaseAdmin
      .from('categories')
      .update({ 
        name: validatedData.name, 
        description: validatedData.description || null,
        image_url: validatedData.image_url || null,
        gender: validatedData.gender,
        slug: slug 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return {
        message: "",
        error: `Failed to update category: ${error.message}`,
      };
    }

    revalidatePath('/admin/categories');
    revalidatePath(`/admin/categories/edit/${id}`);
    return {
      message: `Category "${validatedData.name}" updated successfully!`,
      error: "",
    };
  } catch (error: any) {
    console.error("Category update validation error:", error);
    return {
      message: "",
      error: `Failed to update category: ${error?.message || "Unknown error"}`,
    };
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
