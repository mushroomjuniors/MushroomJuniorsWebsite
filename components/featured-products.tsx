"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";

// Updated Product interface to match the one in product-grid.tsx for consistency
export interface Product {
  id: string; 
  name: string;
  price: number;
  originalPrice?: number; // Added for consistency
  discountText?: string;  // Added for consistency
  image_url?: string | null; 
  category?: string | null; // Added for consistency
  isNew?: boolean | null;   // Changed to match product-grid.tsx (isNew?: boolean | null)
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground max-w-[600px]">
              No featured products available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Our most popular items, handpicked for you
          </p>
        </div>
        {/* Adjusted grid for slightly larger cards than previous step */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"> 
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Copied ProductCard function from components/product-grid.tsx
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  // Note: The addToCart in featured-products.tsx originally mapped image_url to image.
  // The version from product-grid.tsx uses product.image_url directly if available.
  // This should be fine as useCart's addToCart expects `image: string`.

  return (
    <Card className="py-0 overflow-hidden group flex flex-col gap-0">
      <Link href={`/products/${product.id}`} passHref className="block flex leading-none">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg?width=320&height=400"} // Placeholder example
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw" // Adjusted sizes
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <CardContent className="p-2"> 
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 
              className="font-medium text-sm leading-tight truncate" // Font size back to text-sm
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          <p className="font-semibold text-base text-red-600 mt-1"> {/* Font size to text-base, mt back to 1 */}
            ${product.price.toFixed(2)}
          </p>
        </CardContent>

        <CardFooter className="p-2 pt-0"> 
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm" // Font text-sm, removed h-8
            size="sm" 
            onClick={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image_url || "/placeholder.svg",
              quantity: 1,
            })}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" /> {/* Icon size and margin back up slightly */}
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
