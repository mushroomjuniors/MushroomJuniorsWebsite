'use client'; // Or remove if no client-side hooks are strictly needed initially

import Image from 'next/image';
import Link from 'next/link';
import { Product, ProductCard } from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CategoryDetails {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null; // For the large hero image
  slug?: string | null | undefined; // Allow null and undefined
}

interface StickyCategoryProductSectionProps {
  categoryDetails: CategoryDetails;
  products: Product[];
  reverseLayout?: boolean; // To alternate layout (image left/right)
}

export function StickyCategoryProductSection({
  categoryDetails,
  products,
  reverseLayout = false,
}: StickyCategoryProductSectionProps) {
  if (!products || products.length === 0) {
    // Optionally render a message or nothing if no products for this category
    return null; 
  }

  const heroContent = (
    <div className="lg:w-1/2 p-8 flex flex-col justify-center items-start text-center lg:text-left">
      {/* Optional: Smaller title/badge like '+' or 'Recently Added' if needed */}
      {/* <span className="text-sm text-brand-primary font-semibold mb-2">FEATURED COLLECTION</span> */}
      <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">{categoryDetails.name}</h2>
      {categoryDetails.description && (
        <p className="text-md lg:text-lg text-gray-300 mb-6 lg:max-w-md">
          {categoryDetails.description}
        </p>
      )}
      {categoryDetails.slug && (
         <Button asChild variant="outline" className="mt-auto bg-transparent text-white border-white hover:bg-white hover:text-black">
          <Link href={`/products?category=${categoryDetails.slug}`}> 
            View All Collection <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );

  const productGrid = (
    <div className="lg:w-1/2 p-4 lg:p-8 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto"> {/* Adjust max-h based on sticky top and desired scroll height */}
      <div className="grid grid-cols-2 gap-4">
        {products.slice(0, 4).map((product) => ( // Displaying 2x2 grid, max 4 products
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-black"> {/* Using bg-black as per image */}
      {/* Background Image for the whole section */} 
      {categoryDetails.image_url && (
        <Image
          src={categoryDetails.image_url}
          alt={`${categoryDetails.name} background`}
          fill
          className="object-cover opacity-30 lg:opacity-50 z-0" // Adjust opacity
          priority // Consider priority if it's a major LCP element for a section
        />
      )}
      <div className={`relative z-[1] container mx-auto flex flex-col lg:items-stretch ${reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        {/* Sticky Hero Side (on lg screens) */}
        <div className={`lg:w-1/2 lg:sticky lg:top-20 flex flex-col justify-center ${reverseLayout ? 'lg:order-2' : 'lg:order-1'}`}> 
           {/* This div needs a defined height or its content needs to have intrinsic height for sticky to work well if the other side scrolls more than viewport */} 
           {/* For now, making it align with the general section structure which aims for full viewport height */} 
          {heroContent} 
        </div>
        {/* Scrollable Products Side */}
        <div className={`lg:w-1/2 ${reverseLayout ? 'lg:order-1' : 'lg:order-2'}`}> 
          {productGrid}
        </div>
      </div>
    </section>
  );
} 