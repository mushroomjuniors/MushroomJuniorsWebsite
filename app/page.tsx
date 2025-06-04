export const dynamic = "force-dynamic";

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
  title: "Girl's Collection",
  description:
    "Indulge in comfort and quality with our thoughtfully designed girl's collection.",
  backgroundImage: "/girls-collections.webp",
  products: [
    {
      id: "1",
      name: "Ethnic Wear",
      price: 99.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1748796267/os5qaifpnycouo6wq356.jpg",
      link: "/products?category=ethnic",
    },
    {
      id: "2",
      name: "Frocks",
      price: 39.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1749034154/rbacatddkuis7zbkjymp.jpg",
      link: "/products?category=frocks",

    },
    {
      id: "3",
      name: "Gowns",
      price: 89.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1748797365/ixoehetiafksj1jnw0zz.jpg",
      link: "/products?category=gowns",

    },
  ],
}

const menCollection = {
  title: "Boys' Collection",
  description:
    "Define your style with our latest boys' collection. Designed for the confident man, these pieces blend contemporary design with classic appeal.",
  backgroundImage: "/boys-collection.webp",
  products: [
    {
      id: "1",
      name: "Indo Western",
      price: 99.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1748702068/k5aunfrex2ul9njqkpva.jpg",
      link: "/products?category=indo-western"
    },
    {
      id: "2",
      name: "Sherwani",
      price: 39.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1748701716/h8pxfxfqi7m1i7bsi7dq.jpg",
      link: "/products?category=sherwani",

    },
    {
      id: "3",
      name: "Blazers",
      price: 89.0,
      image: "https://res.cloudinary.com/dy0zo3822/image/upload/v1748701051/oqvwkxub1gzi9kzs4acq.jpg",
      link: "/products?category=blazers",

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

// Updated function to get TRENDING products
async function getTrendingProductsData(): Promise<Product[]> { 
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url, image_urls, created_at, is_trending') 
    .eq('is_trending', true) // Fetch only trending products
    .order('created_at', { ascending: false }) 
    .limit(10); // You might want to adjust the limit for trending products

  if (error) {
    console.error('Error fetching trending products:', error.message);
    return [];
  }
  return (data || []).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.image_url || null, 
    image_urls: product.image_urls || null, 
    isNew: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    // is_trending: product.is_trending, // This can be passed if ProductCard uses it
  }));
}

export default async function Home() { 
  const categoriesForOldSection = await getCategoriesForCategorySection();
  const trendingProductsData = await getTrendingProductsData();

 

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ScrollTicker />
      {trendingProductsData.length > 0 && <FeaturedProducts products={trendingProductsData} />}


      <FashionCollection
        womenCollection={womenCollection}
        menCollection={menCollection}
      />
      <div className="container px-4 py-12 mx-auto space-y-16">
        {categoriesForOldSection.length > 0 && <CategorySection categories={categoriesForOldSection} />}
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Ready to upgrade your style?</h2>
          <p className="max-w-[600px] text-gray-600 dark:text-gray-300">
            Discover our latest collections and find your perfect fit.
          </p>
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-700 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black">
            <Link href="/store">
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
