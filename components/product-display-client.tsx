"use client";

import { useState } from "react";
import { ProductGrid, Product } from "@/components/product-grid";
import { ProductFilters } from "@/components/product-filters";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";

interface ProductDisplayClientProps {
  products: Product[];
  initialCategory?: string; // For potential future use in filters or title
  initialSortBy?: string;
  initialMinPrice?: string;
  initialMaxPrice?: string;
}

export function ProductDisplayClient({
  products,
  initialCategory,
  initialSortBy,
  initialMinPrice,
  initialMaxPrice,
}: ProductDisplayClientProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Button & Sheet */}
      <div className="md:hidden flex justify-end mb-4">
        <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              
            </div>
            <ProductFilters
              initialSortBy={initialSortBy}
              initialMinPrice={initialMinPrice}
              initialMaxPrice={initialMaxPrice}
              // If ProductFilters needs to close the sheet on change, a callback can be passed
              // onFilterApplied={() => setIsMobileFilterOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main content area with sidebar and product grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar for Filters */}
        <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5 xl:w-1/6 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-y-auto p-4 rounded-lg border bg-card shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <ProductFilters
            initialSortBy={initialSortBy}
            initialMinPrice={initialMinPrice}
            initialMaxPrice={initialMaxPrice}
          />
        </aside>

        {/* Product Grid Area */}
        <main className="w-full md:w-3/4 lg:w-4/5 xl:w-5/6">
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">No Products Found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new arrivals.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 