import { ProductForm, ProductCategory, ProductFormValues } from "@/components/admin/ProductForm";
import { supabase } from "@/lib/supabaseClient"; // Adjusted to match categories page
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Product | Admin',
};

interface EditProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Partial<ProductFormValues> & { id: string; image_urls?: string[] | null; is_trending?: boolean | null } | null> {
  // const supabase = createClient(); // No longer need to call createClient here
  // We directly use the imported 'supabase' instance
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, stock_quantity, category_id, image_url, image_urls, is_trending, sizes') // Added 'image_urls', 'is_trending', and 'sizes'
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data as Partial<ProductFormValues> & { id: string; image_urls?: string[] | null; is_trending?: boolean | null };
}

async function getCategories(): Promise<ProductCategory[]> {
  // const supabase = createClient(); // No longer need to call createClient here
  // We directly use the imported 'supabase' instance
  const { data, error } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories for edit product form:', error);
    return [];
  }
  return data || [];
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const [product, categories] = await Promise.all([
    getProduct(resolvedParams.id),
    getCategories(),
  ]);

  if (!product) {
    notFound(); // Triggers 404 page if product not found
  }

  if (!categories || categories.length === 0) {
     return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
        <p className="text-red-500">
          No categories found. This is unexpected. Please ensure categories exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Product: {product.name}</h1>
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}
