import Link from "next/link";
import NextImage from "next/image";
import { Card, CardContent } from "@/components/ui/card";

// Define the shape of a category object we expect
interface Category {
  id: string;
  name: string;
  image_url?: string | null; // Optional: for future use
}

interface CategorySectionProps {
  categories: Category[];
}

// Helper function to generate a simple slug
const generateSlug = (name: string) => {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

export function CategorySection({ categories }: CategorySectionProps) {
  if (!categories || categories.length === 0) {
    // Optionally render a message or nothing if no categories are provided
    return (
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground max-w-[600px]">No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground max-w-[600px]">
          Browse our collections and find your perfect style
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categorySlug = generateSlug(category.name);
          // Use category.image_url if available, otherwise a placeholder with text
          const imageUrl = category.image_url
            ? category.image_url
            : `/tshirts.avif?height=700&width=700&text=${encodeURIComponent(category.name)}`;

          return (
            <Link key={category.id} href={`/products?category=${categorySlug}`}>
              <Card className="py-0 overflow-hidden h-[300px] transition-all hover:shadow-lg">
                <CardContent className="p-0 h-full relative">
                  <NextImage
                    src={imageUrl}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Basic responsive sizes, adjust as needed
                  />
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white text-center px-2">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
