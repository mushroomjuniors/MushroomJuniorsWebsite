import Link from 'next/link';
import { supabase } from "@/lib/supabaseClient"; // Adjusted to match categories page
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeleteProductDialog } from "@/components/admin/DeleteProductDialog";
import { ProductImage } from "@/components/admin/ProductImage"; // Import the new component
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Products | Admin',
};

// Base Product type, mirroring the products table structure
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number;
  category_id: string;
  image_url: string | null;
  created_at: string;
  sizes: string[] | null; 
}

// Type for data as it comes directly from Supabase with the join
interface ProductFromSupabaseQueryResult extends Omit<Product, 'category_id'> {
  category_id: string; // Still present from the products table
  categories: { name: string; } | null; // Corrected: Supabase returns joined table as an object for to-one
}

// Final, flattened type for rendering the page
interface ProductPageData extends Product {
  category_name: string | null; // Flattened category name
}

async function getProducts(): Promise<ProductPageData[]> {
  const { data: queryData, error } = await supabase
    .from('products')
    .select<string, ProductFromSupabaseQueryResult>(`
      id,
      name,
      description,
      price,
      stock_quantity,
      image_url,
      created_at,
      category_id, 
      sizes,
      categories (name)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    // throw error; // Or handle as per your app's error strategy
    return [];
  }

  if (!queryData) {
    return [];
  }

  // Explicitly type queryData if Supabase client doesn't infer it perfectly with the select string.
  // However, the generic <string, ProductFromSupabaseQueryResult> on .select() should help.
  const productsFromSupabase: ProductFromSupabaseQueryResult[] = queryData;

  console.log("Raw products from Supabase:", JSON.stringify(productsFromSupabase, null, 2)); // DEBUGGING

  const transformedData: ProductPageData[] = productsFromSupabase.map(product => {
    // 'categories' is now an object { name: string } | null
    const category_name = product.categories ? product.categories.name : null;
    
    // Create a new object without the 'categories' property from the query result
    const { categories, ...restOfProduct } = product;
    return {
      ...restOfProduct, // restOfProduct contains id, name, description, price, stock_quantity, image_url, created_at, sizes, category_id
      category_name,    // Add the flattened category_name
    };
  });
  
  return transformedData;
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <p>No products found. Get started by adding a new product.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableCaption>A list of your products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] sm:w-[80px]">Image</TableHead>
                <TableHead className="min-w-[120px] sm:min-w-[150px]">Name</TableHead>
                <TableHead className="hidden md:table-cell min-w-[120px]">Category</TableHead>
                <TableHead className="hidden sm:table-cell">Sizes</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Price</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <ProductImage src={product.image_url} alt={product.name} />
                  </TableCell>
                  <TableCell className="font-medium min-w-[120px] sm:min-w-[150px] break-words">{product.name}</TableCell>
                  <TableCell className="hidden md:table-cell min-w-[120px] break-words">{product.category_name || 'N/A'}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {product.sizes && product.sizes.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map(size => <Badge key={size} variant="outline">{size}</Badge>)}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right">₹{product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">{product.stock_quantity}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                      {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DeleteProductDialog productId={product.id} productName={product.name} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
