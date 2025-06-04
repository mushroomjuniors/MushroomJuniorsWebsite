"use client"

import { useState, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

// Define the Product interface
export interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string | null; // Changed from 'image'
  category?: string | null; // Assuming 'category' is a string like 'men', 'women'
  isNew?: boolean | null;
  sizes?: string[] | null; // Add sizes property
  created_at?: string; // Add created_at for new arrival logic
  // Add any other properties that come from your Supabase 'products' table
}


const SIZES = ["1-3", "3-6", "6-9", "9-12", "12-15"]; // Define available sizes

export default function StorePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      // Adjust the query to match your Supabase table and columns
      // Example: .select("id, name, price, image_url, category, isNew, sizes, created_at")
      // 'category' might be a foreign key, so you might need to fetch category.name
      // For simplicity, this example assumes 'category' is a direct string column on products
      const { data, error } = await supabase
        .from("products")
        .select("*"); // Select all columns for now, refine as needed

      if (error) {
        console.error("Error fetching products:", error);
        // Handle error appropriately
      } else if (data) {
        // Transform data if necessary to match the Product interface
        // e.g., if your Supabase 'category' is an object or ID
        const transformedProducts = data.map(p => ({
          ...p,
          id: String(p.id), // Ensure id is a string
          // image_url: p.image_url || "/placeholder.svg?height=400&width=300", // Fallback image
          // category: p.category_name || p.category, // Example if category is nested or needs mapping
          // isNew: p.is_new, // Example if column name is different
        }));
        setAllProducts(transformedProducts);
      }
    };
    fetchProducts();
  }, []);


  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  const filteredProducts = allProducts.filter((product) => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesCategory = selectedCategories.length === 0 || (product.category && selectedCategories.includes(product.category));
    
    // New Arrival Logic: Check if product.created_at is within the last 7 days
    let matchesNewArrival = true;
    if (showNewArrivals) {
      if (product.created_at) {
        const productDate = new Date(product.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        matchesNewArrival = productDate > sevenDaysAgo;
      } else {
        // If created_at is not available, it doesn't match "new arrivals" if the filter is on
        matchesNewArrival = false; 
      }
    }
    
    const matchesSize = selectedSizes.length === 0 || (product.sizes && product.sizes.some(s => selectedSizes.includes(s)));
    
    return matchesPrice && matchesCategory && matchesNewArrival && matchesSize;
  });

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => {
            setPriceRange([0, 10000])
            setSelectedCategories([])
            setShowNewArrivals(false)
            setSelectedSizes([])
          }}
        >
          Clear All
        </Button>
      </div>

      {/* <div className="space-y-4">
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
      </div> */}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Price Range</h4>
          <ChevronDown className="h-4 w-4" />
        </div>
        <div className="px-2">
          <Slider
            defaultValue={[0, 10000]}
            max={10000}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-6"
          />
          <div className="flex items-center justify-between">
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
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
          <Checkbox
            id="new-arrivals"
            checked={showNewArrivals}
            onCheckedChange={(checked) => setShowNewArrivals(Boolean(checked))}
          />
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
          {SIZES.map((size) => (
            <Button
              key={size}
              variant={selectedSizes.includes(size) ? "default" : "outline"}
              size="sm"
              className="w-full"
              onClick={() => handleSizeChange(size)}
            >
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
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar />
            </div>
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
