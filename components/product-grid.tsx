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
    <Card className="py-0 overflow-hidden group flex flex-col transition-transform duration-300 ease-in-out group-hover:scale-105">
      <CardContent className="p-0 relative aspect-[4/5] w-full flex-grow">
        <Link href={`/products/${product.id}`} passHref className="block absolute inset-0 z-0">
          <Image
            src={product.image_url || "/placeholder.svg?width=400&height=500"}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                price: product.price,
                image: product.image_url || "/placeholder.svg",
                quantity: 1,
              })
            }}
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Add to Cart</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
