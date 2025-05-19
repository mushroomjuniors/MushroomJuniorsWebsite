import { supabase } from "@/lib/supabaseClient";
import { ProductDetailsClient, Product as ProductType } from "@/components/product-details-client";
import { notFound } from 'next/navigation';

// Define the structure of the raw data from Supabase products table
interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;    // Main image (assuming single URL)
  image_urls: string[] | null; // Array of URLs for gallery
  sizes: string[] | null;
  created_at: string;
  // Note: stock and features columns don't exist in the database
}

async function getProductById(id: string): Promise<ProductType | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      description,
      image_url,
      image_urls,
      sizes,
      created_at
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error.message);
    if (error.code === 'PGRST116') { // Not found or multiple rows (should be not found for .single())
        return null;
    }
    return null; // For other errors, also treat as not found for now
  }
  if (!data) {
    return null;
  }

  const productData = data as SupabaseProduct;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const isNew = new Date(productData.created_at) > sevenDaysAgo;
  
  // Prepare image_urls for the client component
  let finalImageUrls: string[] | null = null;
  if (productData.image_urls && productData.image_urls.length > 0) {
    finalImageUrls = productData.image_urls;
  } else if (productData.image_url) {
    // Fallback: if image_urls is empty but image_url exists, use it as a single-item gallery
    finalImageUrls = [productData.image_url];
  }

  // Default product details if not provided in database
  const details = {
    material: "Cotton 100%",
    fit: "Regular",
    care: "Machine wash, no ironing, don't dry clean, don't tumble dry",
    origin: "Ethically made in Portugal",
  };

  // Generate a random number of viewers between 10-50 for demo purposes
  const viewers = Math.floor(Math.random() * 40) + 10;
  
  return {
    id: productData.id,
    name: productData.name,
    price: productData.price,
    description: productData.description,
    image_url: productData.image_url,
    image_urls: finalImageUrls,
    sizes: productData.sizes,
    colors: null, // Set to null as colors column does not exist
    details: details, // Default details
    isNew,
    stock: 450, // Default stock value (column doesn't exist in DB)
    viewers: viewers, // Random viewers
    reviews: 0, // No reviews yet
    features: [
      "High quality material",
      "Comfortable fit", 
      "Durable construction",
      "Stylish design"
    ], // Default features (column doesn't exist in DB)
    modelInfo: "Model is 1.84 m wearing size M"
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Properly await params in Next.js
  const { id } = await params;

  if (!id) {
    notFound(); 
  }

  const product = await getProductById(id);

  if (!product) {
    notFound(); 
  }

  return <ProductDetailsClient product={product} />;
}

// Optional: For static generation (SSG)
// export async function generateStaticParams() {
//   const { data: products } = await supabase.from('products').select('id').limit(10); // Limit for build time
//   return products?.map(({ id }) => ({ id })) || [];
// }
