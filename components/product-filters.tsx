// components/product-filters.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterX } from "lucide-react";

interface ProductFiltersProps {
  // We might pass initial/default filter values if needed, e.g., from parent server component
  initialSortBy?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

export function ProductFilters({ initialSortBy = "created_at.desc", initialMinPrice = "", initialMaxPrice = "" }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState(initialSortBy);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  // Effect to update state if URL params change (e.g., browser back/forward)
  useEffect(() => {
    setSortBy(searchParams.get("sortBy") || initialSortBy);
    setMinPrice(searchParams.get("minPrice") || initialMinPrice);
    setMaxPrice(searchParams.get("maxPrice") || initialMaxPrice);
  }, [searchParams, initialSortBy, initialMinPrice, initialMaxPrice]);

  const handleApplyFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries())); // Create mutable copy

    if (sortBy) {
      current.set("sortBy", sortBy);
    } else {
      current.delete("sortBy");
    }

    if (minPrice) {
      current.set("minPrice", minPrice);
    } else {
      current.delete("minPrice");
    }

    if (maxPrice) {
      current.set("maxPrice", maxPrice);
    } else {
      current.delete("maxPrice");
    }
    // Preserve category filter if it exists
    const category = searchParams.get("category");
    if (category) {
        current.set("category", category);
    }


    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    router.push(`/products${query}`);
  };
  
  const handleClearFilters = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete("sortBy");
    current.delete("minPrice");
    current.delete("maxPrice");
    // Do not clear category filter here, as it's a primary navigation aspect usually
    // If you want to clear category too, uncomment the line below
    // current.delete("category");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    // Reset local state
    setSortBy(initialSortBy);
    setMinPrice(initialMinPrice);
    setMaxPrice(initialMaxPrice);
    
    router.push(`/products${query}`);
  };


  return (
    <div className="py-4 px-2 md:px-0">
      <h3 className="text-lg font-semibold mb-4 px-2">Filters</h3>
      <div className="flex flex-col gap-6">
        <div className="space-y-2 px-2">
          <Label htmlFor="sort-by">Sort by</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort-by" className="w-full">
              <SelectValue placeholder="Select sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at.desc">Latest</SelectItem>
              <SelectItem value="price.asc">Price: Low to High</SelectItem>
              <SelectItem value="price.desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 px-2">
          <Label htmlFor="min-price">Min Price</Label>
          <Input
            id="min-price"
            type="number"
            placeholder="e.g., 10"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="space-y-2 px-2">
          <Label htmlFor="max-price">Max Price</Label>
          <Input
            id="max-price"
            type="number"
            placeholder="e.g., 100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col gap-2 pt-2 border-t border-border/40 mt-2 px-2">
            <Button onClick={handleApplyFilters} className="w-full" size="sm">
                Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="outline" className="w-full" size="sm">
                <FilterX className="h-4 w-4 mr-2" />
                Clear All
            </Button>
        </div>
      </div>
    </div>
  );
}
