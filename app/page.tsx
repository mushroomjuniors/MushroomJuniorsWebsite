import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/components/ui/product-card"; 
import { FeaturedProducts } from "@/components/featured-products";
import { HeroSection } from "@/components/hero-section";
import { CategorySection } from "@/components/category-section";
import { StickyHeroCategoryDisplay, HeroDetails, CategoryItem } from "@/components/sticky-hero-category-display";
import { supabase } from "@/lib/supabaseClient";
import { ScrollTicker } from "@/components/scroll-ticker";
import { CTAPopup } from "@/components/cta-popup";
import FashionCollection from "@/components/fashion-collection"

// Sample data for the collections
const womenCollection = {
  title: "Women's Collection",
  description:
    "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. NULLA CONSEQUAT EGESTAS NISI. VESTIBULUM MALESUADA FERMENTUM NIBH. DONEC VENENATIS, NEQUE ET PELLENTESQUE EFFICITUR, LECTUS EST PRETI.",
  backgroundImage: "/images/woman-bg.png",
  products: [
    {
      id: "1",
      name: "CLASSIC SHADES",
      price: 99.0,
      image: "/images/classic-shades.webp",
    },
    {
      id: "2",
      name: "CLASSIC BACKPACK",
      price: 39.0,
      image: "/images/classic-shades.webp",
    },
    {
      id: "3",
      name: "SHIELD SHADES",
      price: 89.0,
      image: "/images/product-shield.webp",
    },
  ],
}

const menCollection = {
  title: "Men's Collection",
  description:
    "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. NULLA CONSEQUAT EGESTAS NISI. VESTIBULUM MALESUADA FERMENTUM NIBH. DONEC VENENATIS, NEQUE ET PELLENTESQUE EFFICITUR, LECTUS EST PRETI.",
  backgroundImage: "/images/men-bg.webp",
  products: [
    {
      id: "4",
      name: "CLASSIC LOAFER",
      price: 40.0,
      image: "/images/satchel.webp",
    },
    {
      id: "5",
      name: "VINTAGE BOX",
      price: 49.0,
      image: "/images/vintage box.webp",
    },
    {
      id: "6",
      name: "SHIELD GLASSES",
      price: 89.0,
      image: "/images/product-shield.webp",
    },
  ],
}

// Existing function to get ALL categories for the CategorySection component
async function getCategoriesForCategorySection(): Promise<any[]> { // Using any for now, replace with actual Category type for CategorySection
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, image_url, slug') // Ensure slug is fetched if CategorySection uses it
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching categories for CategorySection:', error.message);
    return [];
  }
  return data || [];
}

// Existing function to get featured products if you're keeping that section
async function getFeaturedProductsData(): Promise<Product[]> { 
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url, image_urls, created_at') 
    .order('created_at', { ascending: false }) 
    .limit(5); // Featured products limit

  if (error) {
    console.error('Error fetching featured products:', error.message);
    return [];
  }
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url || null, 
    image_urls: product.image_urls || null, 
    isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  }));
}

export default async function Home() { 
  const categoriesForOldSection = await getCategoriesForCategorySection();
  const featuredProductsData = await getFeaturedProductsData();

 

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ScrollTicker />
      {featuredProductsData.length > 0 && <FeaturedProducts products={featuredProductsData} />}


      <FashionCollection
        womenCollection={womenCollection}
        menCollection={menCollection}
      />
      <div className="container px-4 py-12 mx-auto space-y-16">
        {categoriesForOldSection.length > 0 && <CategorySection categories={categoriesForOldSection} />}
        {featuredProductsData.length > 0 && <FeaturedProducts products={featuredProductsData} />}
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ready to upgrade your style?</h2>
          <p className="max-w-[600px] text-gray-600 dark:text-gray-300">
            Discover our latest collections and find your perfect fit.
          </p>
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop All Products
            </Link>
          </Button>
        </div>
      </div>

       
      
      <CTAPopup />
    </div>
  );
}
