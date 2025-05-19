"use client"

import { useEffect, useState } from "react"
// Link, Image, Card, CardContent, CardFooter, Button, ShoppingCart, useCart are no longer needed directly
// as they are encapsulated in the imported ProductCard or handled within it.

import { supabase } from "@/lib/supabaseClient";

// Import the shared ProductCard and Product interface
import { ProductCard, Product } from "@/components/ui/product-card";

// Removed local Product interface

interface RandomProductsProps {
  excludeProductId: string | number; 
  count?: number;
  title?: string;
}

export function RandomProducts({ 
  excludeProductId, 
  count = 4, 
  title = "You May Also Like" 
}: RandomProductsProps) {
  const [randomProducts, setRandomProducts] = useState<Product[]>([])
  // useCart's addToCart is now handled within the imported ProductCard

  useEffect(() => {
    const fetchAndSetRandomProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, image_urls, created_at") // Added image_urls
        .limit(50); 

      if (error) {
        console.error("Error fetching products for RandomProducts:", error);
        return;
      }

      if (data) {
        const transformedData: Product[] = data.map(p => ({
          id: String(p.id),
          name: p.name,
          price: p.price,
          image_url: p.image_url,
          image_urls: p.image_urls, // Pass image_urls through
          // isNew could be determined here if needed by Product interface or card logic directly
          // isNew: new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        }));

        const availableProducts = transformedData.filter(
          (product) => String(product.id) !== String(excludeProductId)
        );
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, count));
      }
    };

    fetchAndSetRandomProducts();
  }, [excludeProductId, count]);

  if (randomProducts.length === 0) {
    return null; 
  }

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex flex-col items-center text-center space-y-3 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground max-w-[600px]">Discover more products you might love</p>
          </div>
        )}
        {/* Desktop view - grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {randomProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {/* Mobile view - horizontal scrollable */}
        <div className="md:hidden flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {randomProducts.map((product) => (
            <div key={product.id} className="min-w-[85%] snap-start">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}</style>
      </div>
    </section>
  );
}
