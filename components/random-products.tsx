"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"

// Sample product data - in a real app, you would fetch this from an API
const allProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 29.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
  },
  {
    id: 2,
    name: "Slim Fit Jeans",
    price: 59.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
  },
  {
    id: 3,
    name: "Summer Floral Dress",
    price: 79.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: true,
  },
  {
    id: 4,
    name: "Casual Hoodie",
    price: 49.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
  },
  {
    id: 5,
    name: "Denim Jacket",
    price: 89.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: true,
  },
  {
    id: 6,
    name: "Pleated Skirt",
    price: 45.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: false,
  },
  {
    id: 7,
    name: "Knit Sweater",
    price: 65.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "women",
    isNew: true,
  },
  {
    id: 8,
    name: "Cargo Pants",
    price: 55.99,
    image: "/placeholder.svg?height=400&width=300",
    category: "men",
    isNew: false,
  },
]

export function RandomProducts({ excludeProductId, count = 4, title = "You May Also Like" }) {
  const [randomProducts, setRandomProducts] = useState([])
  const { addToCart } = useCart()

  useEffect(() => {
    // Filter out the current product and get random products
    const availableProducts = allProducts.filter((product) => product.id !== excludeProductId)
    const shuffled = [...availableProducts].sort(() => 0.5 - Math.random())
    setRandomProducts(shuffled.slice(0, count))
  }, [excludeProductId, count])

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground max-w-[600px]">Discover more products you might love</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {randomProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {product.isNew && <Badge className="absolute top-2 right-2">New</Badge>}
              </div>
            </Link>
            <CardContent className="p-4">
              <Link href={`/products/${product.id}`} className="hover:underline">
                <h3 className="font-medium">{product.name}</h3>
              </Link>
              <p className="font-bold mt-1">${product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" size="sm" onClick={() => addToCart(product)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
