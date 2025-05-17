import { ProductForm, ProductCategory } from "@/components/admin/ProductForm";
import { supabase } from "@/lib/supabaseClient"; // Adjusted to match categories page
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Product | Admin',
};

async function getCategories(): Promise<ProductCategory[]> {
  // const supabase = createClient(); // No longer need to call createClient here
  // We directly use the imported 'supabase' instance
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories for new product form:', error);
    return []; // Or throw an error, or handle more gracefully
  }
  return data || [];
}

export default async function NewProductPage() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    // Consider what to do if no categories exist - maybe prompt to create one first?
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
        <p className="text-red-500">
          No categories found. Please create a category before adding a product.
        </p>
        {/* Optionally, add a link to the create category page */}
        {/* <Link href="/admin/categories/new" className="text-blue-500 hover:underline">Create a Category</Link> */}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create New Product</h1>
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
