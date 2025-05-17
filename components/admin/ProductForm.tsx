"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/admin/products/actions";
import { Checkbox } from "@/components/ui/checkbox";

// Simple type for categories passed as props
export interface ProductCategory {
  id: string;
  name: string;
}

// Zod schema for the form, matches ProductActionSchema from actions.ts
const productFormSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().positive(),
  stock_quantity: z.coerce.number().int().min(0),
  category_id: z.string().uuid("Please select a category."),
  image_url: z.string().url("Invalid URL format").optional().or(z.literal('')),
  sizes: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL"])).optional(),
});

export const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormValues> & { id?: string };
  categories: ProductCategory[]; // Categories for the dropdown
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData?.id;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      category_id: "",
      image_url: "",
      sizes: [],
    },
    mode: "onChange",
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      let result;
      if (isEditMode && initialData?.id) {
        result = await updateProduct(initialData.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result.error) {
        // You might want to parse result.fields here for form-specific errors
        throw new Error(result.error + (result.fields ? ` (${Object.values(result.fields).join(', ')})` : ''));
      }

      toast.success(isEditMode ? "Product updated" : "Product created", {
        description: isEditMode
          ? `The product "${data.name}" has been updated.`
          : `A new product "${data.name}" has been created.`,
      });
      router.push("/admin/products");
      router.refresh(); // Refresh server components to reflect changes
    } catch (error: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: error.message || "There was a problem with your request.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name and Category Fields - 2 columns on md+ */}
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-6">
          <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Cotton Onesie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* End of Name Field in grid */}

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        </div> {/* End of Name/Category grid div */}

        {/* Description Field - full width */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the product."
                  className="resize-none"
                  {...field}
                  value={field.value || ""} // Ensure value is not null
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* End of Description Field */}

        {/* Price and Stock Quantity Fields - 2 columns on md+ */}
        <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-6">
          <FormField
            control={form.control}
            name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 25.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* End of Price Field in grid */}

        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="e.g., 100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div> {/* End of Price/Stock grid div */}

        {/* Image URL Field - full width */}
        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>
                Link to the main product image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sizes Field - Refactored for responsiveness */}
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Sizes</FormLabel>
              <FormDescription>
                Select all sizes that apply to this product.
              </FormDescription>
              {/* Responsive grid for checkboxes */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {availableSizes.map((size) => (
                  <FormItem 
                    key={size} 
                    className="flex flex-row items-center space-x-2 rounded-md border p-3 hover:bg-accent hover:text-accent-foreground"
                  >
                    <FormControl>
                      <Checkbox
                        id={`size-${size}`}
                        checked={field.value?.includes(size)}
                        onCheckedChange={(checked) => {
                          const currentSizes = field.value || [];
                          if (checked) {
                            field.onChange([...currentSizes, size]);
                          } else {
                            field.onChange(currentSizes.filter((s) => s !== size));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel htmlFor={`size-${size}`} className="font-normal cursor-pointer flex-1">
                      {size}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full md:w-auto">
          {form.formState.isSubmitting 
            ? (isEditMode ? "Saving..." : "Creating...") 
            : (isEditMode ? "Save Changes" : "Create Product")}
        </Button>
      </form>
    </Form>
  );
}
