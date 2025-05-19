import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/components/product-grid"; 
import { ProductDisplayClient } from "@/components/product-display-client";

async function getCategoryIdByName(categoryName: string): Promise<string | null> {
  if (!categoryName) return null;
  
  // First try direct slug match if you have a slug column
  const { data: slugData, error: slugError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categoryName)
    .maybeSingle();
    
  if (slugData?.id) {
    return slugData.id;
  }
  
  // Fallback to name-based matching
  const formattedName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 

  // Try exact match first
  const { data: exactData, error: exactError } = await supabase
    .from('categories')
    .select('id')
    .eq('name', formattedName)
    .maybeSingle();
    
  if (exactData?.id) {
    return exactData.id;
  }
  
  // Try ILIKE as last resort
  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', formattedName)
    .maybeSingle();

  if (error || !data) {
    console.warn(`Category ID not found for name derived from slug: ${categoryName}`, error?.message);
    return null;
  }
  return data.id;
}


interface GetProductsParams {
  categorySlug?: string;
  sortBy?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getProducts({
  categorySlug,
  sortBy = "created_at.desc", 
  minPrice,
  maxPrice,
}: GetProductsParams): Promise<Product[]> {
  let query = supabase.from("products").select(`
    id,
    name,
    price,
    image_url,
    image_urls,
    created_at, 
    category_id,
    categories ( name ) 
  `); 


  if (categorySlug) {
    const categoryId = await getCategoryIdByName(categorySlug);
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    } else {
      console.warn(`No products will be fetched as category for slug '${categorySlug}' was not found.`);
      return []; 
    }
  }

  if (minPrice) {
    query = query.gte("price", parseFloat(minPrice));
  }
  if (maxPrice) {
    query = query.lte("price", parseFloat(maxPrice));
  }

  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(".");
    if (sortField && sortOrder) {
      query = query.order(sortField as any, { ascending: sortOrder === "asc" });
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error.message);
    return [];
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    image_url: item.image_url,
    image_urls: item.image_urls,
    isNew: new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
  }));
}

// Helper function to convert slug back to a readable title
function slugToTitle(slug: string): string {
  return slug
    .split('-') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const categorySlug = searchParams?.category as string | undefined;
  const sortBy = searchParams?.sortBy as string | undefined;
  const minPrice = searchParams?.minPrice as string | undefined;
  const maxPrice = searchParams?.maxPrice as string | undefined;

  const products = await getProducts({
    categorySlug: categorySlug,
    sortBy,
    minPrice,
    maxPrice,
  });

  // Use our utility function for consistent title formatting
  const pageTitle = categorySlug 
    ? `${slugToTitle(categorySlug)} Products` 
    : "All Products";

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {pageTitle}
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg sm:text-xl">
          Explore our curated collection. Filter by price or sort to find your perfect item.
        </p>
      </div>

      <ProductDisplayClient 
        products={products}
        initialCategory={categorySlug}
        initialSortBy={sortBy}
        initialMinPrice={minPrice}
        initialMaxPrice={maxPrice}
      />
    </div>
  );
}
