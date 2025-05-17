"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart-provider";

// Updated Product interface to match expected fetched data and for use in app/page.tsx
export interface Product {
  id: string; 
  name: string;
  image_url?: string | null; 
  price: number;
  isNew?: boolean; 
}

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (!products || products.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="text-muted-foreground max-w-[600px]">
            No featured products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
        <p className="text-muted-foreground max-w-[600px]">
          Our most popular items, handpicked for you
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Adapt the product object for the addToCart function
    // Assuming addToCart expects an 'image' field and 'quantity'
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "/placeholder.svg", // Map image_url to image
      quantity: 1, // Default quantity when adding from featured products
    });
  };

  return (
    <Card className="py-0 overflow-hidden group">
      <Link href={`/products/${product.id}`} passHref>
        <div className="relative aspect-[3/4] overflow-hidden cursor-pointer"> {/* Adjusted aspect ratio */}
          <Image
            src={product.image_url || "/placeholder.svg?width=300&height=400"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" // Responsive image sizes
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && (
            <Badge className="absolute top-2 right-2">New</Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`} passHref>
          <h3 className="font-medium hover:underline cursor-pointer truncate" title={product.name}>{product.name}</h3>
        </Link>
        <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
