import { supabase } from "@/lib/supabaseClient"; // Using the public client for reads is fine
import { CategoryForm } from "@/components/admin/CategoryForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notFound } from 'next/navigation';
import type { Category } from "../../page"; // Re-using Category type from the list page

async function getCategory(id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which we handle with notFound()
    console.error('Error fetching category:', error);
    // We will treat other errors as category not found for simplicity
    return null;
  }
  return data as Category | null;
}

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  if (!params.id) {
    notFound(); // Should not happen with a valid route structure, but good practice
  }
  const category = await getCategory(params.id);

  if (!category) {
    notFound(); // Triggers the not-found page if category doesn't exist or ID is bad
  }

  // We need to ensure the initialData in CategoryForm matches CategoryFormValues expectation
  // Specifically, description can be null from DB but form expects string | undefined
  const formInitialData = {
    ...category,
    description: category.description || undefined,
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Category</CardTitle>
          <CardDescription>
            Update the details for the category: <strong>{category.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass the category.id explicitly for the edit action */}
          <CategoryForm initialData={{ ...formInitialData, id: category.id }} />
        </CardContent>
      </Card>
    </div>
  );
}
