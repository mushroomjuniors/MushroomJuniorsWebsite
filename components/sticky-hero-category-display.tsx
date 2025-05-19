'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card'; // For individual category cards

// Details for the main hero part of the section
export interface HeroDetails {
  name: string; // e.g., "Woman Collection"
  description?: string | null;
  main_image_url?: string | null; // For the large hero background
  cta_link?: string | null; // Link for the "View All Collection" button
  cta_text?: string | null;
}

// Details for each category item to be displayed in the grid
export interface CategoryItem {
  id: string;
  name: string;
  image_url?: string | null;
  slug: string; // Link to /products?category=[slug]
}

interface StickyHeroCategoryDisplayProps {
  heroDetails: HeroDetails;
  categories: CategoryItem[];
  reverseLayout?: boolean;
}

export function StickyHeroCategoryDisplay({
  heroDetails,
  categories,
  reverseLayout = false,
}: StickyHeroCategoryDisplayProps) {
  if (!categories || categories.length === 0) {
    return null; 
  }

  const heroContent = (
    <div className="lg:w-1/2 p-8 flex flex-col justify-center items-start text-center lg:text-left min-h-[300px] lg:min-h-0">
      <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-white">{heroDetails.name}</h2>
      {heroDetails.description && (
        <p className="text-md lg:text-lg text-gray-300 mb-6 lg:max-w-md">
          {heroDetails.description}
        </p>
      )}
      {heroDetails.cta_link && (
         <Button asChild variant="outline" className="mt-auto bg-transparent text-white border-white hover:bg-white hover:text-black">
          <Link href={heroDetails.cta_link}> 
            {heroDetails.cta_text || "View All Collection"} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );

  const categoryGrid = (
    // Adjust max-h based on sticky top and desired scroll height. Consider lg:h-screen if the hero side is also meant to be full height.
    <div className="lg:w-1/2 p-4 lg:p-8 lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {categories.slice(0, 4).map((category) => ( // Displaying 2x2 grid, max 4 categories
          <Link key={category.id} href={`/products?category=${category.slug}`} className="block group">
            <Card className="overflow-hidden h-full flex flex-col bg-black/30 backdrop-blur-sm border-gray-700 hover:border-white transition-colors">
              <CardContent className="p-0 relative aspect-square w-full flex-grow">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image</span>
                  </div>
                )}
              </CardContent>
              <div className="p-3 text-center bg-black/50">
                <h3 className="font-semibold text-sm text-white truncate group-hover:underline" title={category.name}>
                  {category.name}
                </h3>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-black">
      {heroDetails.main_image_url && (
        <Image
          src={heroDetails.main_image_url}
          alt={`${heroDetails.name} background`}
          fill
          className="object-cover opacity-30 lg:opacity-40 z-0"
          priority // Consider for LCP if this section is high up
        />
      )}
      <div className={`relative z-[1] container mx-auto flex flex-col lg:items-stretch ${reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
        <div className={`lg:w-1/2 lg:sticky lg:top-20 flex flex-col justify-center ${reverseLayout ? 'lg:order-2' : 'lg:order-1'}`}> 
          {heroContent} 
        </div>
        <div className={`lg:w-1/2 ${reverseLayout ? 'lg:order-1' : 'lg:order-2'}`}> 
          {categoryGrid}
        </div>
      </div>
    </section>
  );
} 