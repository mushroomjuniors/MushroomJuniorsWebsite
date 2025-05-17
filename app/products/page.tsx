import { supabase } from "@/lib/supabaseClient";
import { ProductGrid, Product } from "@/components/product-grid"; 
import { ProductFilters } from "@/components/product-filters";

async function getCategoryIdByName(categoryName: string): Promise<string | null> {
  if (!categoryName) return null;
  const formattedName = categoryName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 

  const { data, error } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', `%${formattedName}%`) 
    .single();

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
    isNew: new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
  }));
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const category = searchParams?.category as string | undefined;
  const sortBy = searchParams?.sortBy as string | undefined;
  const minPrice = searchParams?.minPrice as string | undefined;
  const maxPrice = searchParams?.maxPrice as string | undefined;

  const products = await getProducts({
    categorySlug: category,
    sortBy,
    minPrice,
    maxPrice,
  });

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {category ? `${category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}` : "All Products"}
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-lg sm:text-xl">
          Explore our curated collection. Filter by price or sort to find your perfect item.
        </p>
      </div>

      {/* Main content area with sidebar and product grid */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar for Filters - sticky on medium screens and up */}
        <aside className="w-full md:w-1/4 lg:w-1/5 xl:w-1/6 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:overflow-y-auto p-1 rounded-lg border border-border/40 bg-background shadow-sm">
          <ProductFilters 
            initialSortBy={sortBy}
            initialMinPrice={minPrice}
            initialMaxPrice={maxPrice}
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
    </div>
  );
}
