import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/components/product-grid"; 
import { ProductDisplayClient } from "@/components/product-display-client";

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

  const pageTitle = categorySlug 
    ? `${categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Products` 
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
