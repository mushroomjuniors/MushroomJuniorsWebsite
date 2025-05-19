"use client";

import Link from "next/link";
// Image, Card, CardContent, CardFooter, Button, ShoppingCart, useCart are no longer needed directly here
// as they are encapsulated in the imported ProductCard

// Import the updated ProductCard and Product interface from the new shared location
import { ProductCard, Product } from "@/components/ui/product-card";

interface FeaturedProductsProps {
  products: Product[]; // Uses the imported Product interface
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
            // Use the imported ProductCard component
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
