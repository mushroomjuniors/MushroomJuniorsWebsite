"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

// Define a Product type similar to other components, adapt as needed for random products card
interface Product {
  id: string; // Changed from number to string to match Supabase UUIDs
  name: string;
  price: number;
  image_url?: string | null; // Changed from 'image' to 'image_url'
  category?: string; // Kept optional
  isNew?: boolean;   // Kept optional
}

interface RandomProductsProps {
  excludeProductId: string | number; // Allow number for flexibility if old IDs were numbers
  count?: number;
  title?: string;
}

// Removed the static allProducts array

export function RandomProducts({ 
  excludeProductId, 
  count = 4, 
  title = "You May Also Like" 
}: RandomProductsProps) {
  const [randomProducts, setRandomProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchAndSetRandomProducts = async () => {
      // Fetch products from Supabase
      // You might want to add more specific filtering or ordering for "trending"
      // For now, fetching a broader set and then randomizing locally.
      // Consider limiting the initial fetch if your products table is very large.
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, created_at") // Fetch necessary fields
        .limit(50); // Fetch a decent pool to randomize from, adjust as needed

      if (error) {
        console.error("Error fetching products for RandomProducts:", error);
        return;
      }

      if (data) {
        const transformedData: Product[] = data.map(p => ({
          ...p,
          id: String(p.id),
          // Example: determine isNew based on created_at if needed by card
          // isNew: new Date(p.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        }));

        const availableProducts = transformedData.filter(
          (product) => String(product.id) !== String(excludeProductId) // Ensure IDs are compared as strings
        );
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, count));
      }
    };

    fetchAndSetRandomProducts();
  }, [excludeProductId, count]);

  if (randomProducts.length === 0) {
    return null; // Or a loading state, or a message if no related products found
  }

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground max-w-[600px]">Discover more products you might love</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {randomProducts.map((product) => (
            // Applying the new card design from product-grid.tsx
            <Card key={product.id} className="py-0 overflow-hidden group flex flex-col transition-transform duration-300 ease-in-out group-hover:scale-105">
              <CardContent className="p-0 relative aspect-[4/5] w-full flex-grow">
                <Link href={`/products/${product.id}`} passHref className="block absolute inset-0 z-0">
                  <Image
                    src={product.image_url || "/placeholder.svg?width=300&height=375"} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
                </Link>
                
                <div className="absolute inset-x-0 bottom-0 p-3 flex flex-row justify-between items-center z-10">
                  <div>
                    <Link href={`/products/${product.id}`} className="hover:underline">
                      <h3 
                        className="font-semibold text-sm text-white leading-tight truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    {/* <p className="font-semibold text-base text-red-600 mt-1">
                      ${product.price.toFixed(2)}
                    </p> */}
                    <p className="text-xs text-white/80">Enquire for price</p>
                  </div>
                  <Button 
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-white/20 hover:bg-white/30 border-white/30 text-white rounded-full backdrop-blur-sm flex-shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart({
                        id: product.id, 
                        name: product.name, 
                        price: product.price, // Product interface here has price: number. cart-provider expects price?: number.
                        image: product.image_url || "/placeholder.svg",
                        quantity: 1 
                      });
                    }}
                    title="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="sr-only">Add to Cart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
