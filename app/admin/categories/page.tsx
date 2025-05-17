import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, // Needed for Edit link
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteCategoryDialog } from "@/components/admin/DeleteCategoryDialog";

// Define a type for our category data
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) {
    console.error('Error fetching categories:', error);
    // In a real app, you might throw the error or return a specific error state
    return [];
  }
  return data || [];
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Manage Categories</h1>
        <Button asChild size="sm" className="h-8 gap-1">
          <Link href="/admin/categories/new"> {/* We'll create this page later */}
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Category
            </span>
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            View and manage your product categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Created At</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {category.description || '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {/* Links will eventually go to /admin/categories/edit/[id] */}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/categories/edit/${category.id}`}>
                              <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DeleteCategoryDialog categoryId={category.id} categoryName={category.name} />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No categories found. Start by adding a new one.
            </p>
          )}
        </CardContent>
        {categories.length > 0 && (
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>{categories.length}</strong> categor{categories.length === 1 ? 'y' : 'ies'}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
