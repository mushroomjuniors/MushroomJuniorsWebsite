import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import Product type as FeaturedProductType to avoid naming conflict if Category also had a Product export
import { FeaturedProducts, Product as FeaturedProductType } from "@/components/featured-products"; 
import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/category-section";
import { supabase } from "@/lib/supabaseClient";

// Define a simple type for categories, matching what CategorySection expects
interface Category {
  id: string;
  name: string;
  image_url?: string | null; 
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name') // We only need id and name for now
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error.message);
    return []; // Return empty array on error or if no data
  }
  return data || [];
}

// Function to fetch featured products
async function getFeaturedProducts(): Promise<FeaturedProductType[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url, created_at') // Fetch images and created_at
    .order('created_at', { ascending: false }) // Get newest first
    .limit(4); // Limit to 4 featured products

  if (error) {
    console.error('Error fetching featured products:', error.message);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    // Use the first image URL if images array exists and is not empty, otherwise null
    image_url: product.image_url || null, // Use product.image_url (singular) directly
      isNew: new Date(product.created_at) > sevenDaysAgo,
  }));
}


export default async function Home() { 
  const categories = await getCategories();
  const featuredProducts = await getFeaturedProducts(); // Fetch featured products

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <div className="container px-4 py-12 mx-auto space-y-16">
        <CategorySection categories={categories} /> {/* Pass fetched categories */}
        {/* Pass fetched products to FeaturedProducts */}
        <FeaturedProducts products={featuredProducts} /> 
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to upgrade your style?
          </h2>
          <p className="max-w-[600px] text-muted-foreground">
            Discover our latest collections and find your perfect fit.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
