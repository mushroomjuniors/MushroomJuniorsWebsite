"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const products = [
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

export default function StorePage() {
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category)
    return matchesPrice && matchesCategory
  })

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => {
            setPriceRange([0, 100])
            setSelectedCategories([])
          }}
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Categories</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-men"
              checked={selectedCategories.includes("men")}
              onCheckedChange={() => handleCategoryChange("men")}
            />
            <Label htmlFor="category-men">Men</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-women"
              checked={selectedCategories.includes("women")}
              onCheckedChange={() => handleCategoryChange("women")}
            />
            <Label htmlFor="category-women">Women</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-accessories"
              checked={selectedCategories.includes("accessories")}
              onCheckedChange={() => handleCategoryChange("accessories")}
            />
            <Label htmlFor="category-accessories">Accessories</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Price Range</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="px-2">
          <Slider
            defaultValue={[0, 100]}
            max={100}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">New Arrivals</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="new-arrivals" />
          <Label htmlFor="new-arrivals">Show only new arrivals</Label>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Size</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
            <Button key={size} variant="outline" size="sm" className="w-full">
              {size}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground max-w-[600px]">Browse our complete collection of premium clothing</p>
      </div>

      <div className="lg:hidden flex justify-end mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterSidebar />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block w-1/4">
          <FilterSidebar />
        </div>
        <div className="lg:w-3/4">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}
