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
    "Indulge in comfort and quality with our thoughtfully designed women's collection.",
  backgroundImage: "/images/woman-bg.png",
  products: [
    {
      id: "1",
      name: "Midis",
      price: 99.0,
      image: "/images/midis.webp",
      link: "/products?category=midis",
    },
    {
      id: "2",
      name: "Gowns",
      price: 39.0,
      image: "/images/gowns.jpg",
      link: "/products?category=gowns",

    },
    {
      id: "3",
      name: "Ethnic Wear",
      price: 89.0,
      image: "/images/ethnic.webp",
      link: "/products?category=ethnic",

    },
  ],
}

const menCollection = {
  title: "Men's Collection",
  description:
    "Define your style with our latest men's collection. Designed for the confident man, these pieces blend contemporary design with classic appeal.",
  backgroundImage: "/images/men-bg.webp",
  products: [
    {
      id: "1",
      name: "Tuxedos",
      price: 99.0,
      image: "/images/tuxedos.webp",
      link: "/products?category=tuxedos"
    },
    {
      id: "2",
      name: "Men's Party Wear",
      price: 39.0,
      image: "/images/men-party-wear.jpg",
      link: "/products?category=men-party-wear",

    },
    {
      id: "3",
      name: "Jodhpuri",
      price: 89.0,
      image: "/images/jodhpuri.webp",
      link: "/products?category=jodhpuri",

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
        {trendingProductsData.length > 0 && <FeaturedProducts products={trendingProductsData} />}
        
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
