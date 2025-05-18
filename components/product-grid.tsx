"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"

export interface Product {
  id: string; 
  name: string;
  price: number;
  originalPrice?: number;
  discountText?: string;
  image_url?: string | null; 
  category?: string | null;
  isNew?: boolean | null;
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <Card className="py-0 overflow-hidden group flex flex-col gap-0">
      <Link href={`/products/${product.id}`} passHref className="block flex leading-none">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg?width=400&height=500"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="border-t border-gray-200 dark:border-gray-700">
        <CardContent className="p-3">
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 
              className="font-medium text-sm leading-tight truncate"
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
          <p className="font-semibold text-base text-red-600 mt-1">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>

        <CardFooter className="p-3 pt-0">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm"
            size="sm"
            onClick={() => addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image_url || "/placeholder.svg",
              quantity: 1,
            })}
          >
            <ShoppingCart className="h-4 w-4 mr-1.5" />
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
