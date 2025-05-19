"use client"

import Link from "next/link"
import Image from "next/image"
// Card, Button, ShoppingCart, Eye, Share2, useCart, useState, useRouter are no longer needed directly here
// as they are encapsulated in the imported ProductCard

// Import the new shared ProductCard and Product interface
import { ProductCard, Product } from "@/components/ui/product-card"; // Adjusted path

// Removed duplicated Product interface
// Removed ProductCard function definition

export { type Product }; // Re-export Product type if other components import it from here

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
