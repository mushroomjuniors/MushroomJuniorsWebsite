"use client";

import * as React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
// import { generateSlug } from "@/lib/utils"; // Assuming you have a slug generation utility

// Helper function to generate a simple slug (if not available from utils)
const generateSlug = (name: string) => {
  if (!name) return '';
  
  // Convert to lowercase and remove accents
  let slug = name.toLowerCase();
  
  // Handle fractions like 3/4 - keep numbers together
  slug = slug.replace(/(\d+)\/(\d+)/g, '$1$2');
  
  // Replace apostrophes and special chars with nothing (remove them)
  slug = slug.replace(/['']/g, '');
  
  // Replace spaces and other non-alphanumeric chars with hyphens
  slug = slug.replace(/[^a-z0-9]+/g, '-');
  
  // Remove leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');
  
  return slug;
};

// Helper to chunk array into groups of 8
function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

// Define the shape of a category object we expect
interface Category {
  id: string;
  name: string;
  image_url?: string | null; // Optional: for future use
  itemCount?: number; // For "X items", data needs to be provided
}

interface CategorySectionProps {
  categories: Category[];
  title?: string;
}

export function CategorySection({ categories, title = "Season Collection" }: CategorySectionProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Chunk categories into groups of 8 for carousel pages
  const chunkedCategories = chunkArray(categories, 8);

  if (!categories || categories.length === 0) {
    // Optionally render a message or nothing if no categories are provided
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
            <p className="text-muted-foreground">No categories available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => api?.scrollPrev()} disabled={!api?.canScrollPrev()}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous category</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => api?.scrollNext()} disabled={!api?.canScrollNext()}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next category</span>
            </Button>
          </div>
        </div>

        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {chunkedCategories.map((group, pageIndex) => (
              <CarouselItem key={pageIndex}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
                  {group.map((category) => {
                    const categorySlug = generateSlug(category.name);
                    const imageUrl = category.image_url 
                      ? category.image_url 
                      : `/placeholder.svg?height=400&width=300&text=${encodeURIComponent(category.name)}`;
                    return (
                      <Link href={`/products?category=${categorySlug}`} className="block group" key={category.id}>
                        <Card className="py-0 overflow-hidden h-full flex flex-col">
                          <CardContent className="p-0 relative aspect-[4/5] w-full flex-grow">
                            <NextImage
                              src={imageUrl}
                              alt={category.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/70 via-black/50 to-transparent pointer-events-none" />
                            <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-end">
                              <div>
                                <h3 className="text-lg font-semibold text-white leading-tight">
                                  {category.name}
                                </h3>
                                <p className="text-xs text-white/80">
                                  {category.itemCount !== undefined ? `${category.itemCount} items` : `Explore`}
                                </p>
                              </div>
                              <Button variant="outline" size="icon" className="h-8 w-8 bg-white/20 hover:bg-white/30 border-white/30 text-white rounded-full backdrop-blur-sm flex-shrink-0">
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">View {category.name}</span>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Optional: Use CarouselPrevious/CarouselNext if preferred over custom buttons above */}
          {/* <CarouselPrevious /> */}
          {/* <CarouselNext /> */}
        </Carousel>
        
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2 w-2 rounded-full transition-colors duration-200 ease-out 
                ${current === index + 1 ? "bg-slate-900 scale-125" : "bg-slate-300 hover:bg-slate-400"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
