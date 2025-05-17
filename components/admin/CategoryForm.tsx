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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createCategory, updateCategory } from "@/app/admin/categories/actions";

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }).max(100, {
    message: "Category name must not be longer than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must not be longer than 500 characters.",
  }).optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues> & { id?: string }; // For editing later
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  
  const isEditMode = !!initialData?.id;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || { name: "", description: "" },
    mode: "onChange",
  });

  async function onSubmit(data: CategoryFormValues) {
    try {
      let result;
      if (isEditMode && initialData?.id) {
        result = await updateCategory(initialData.id, data);
      } else {
        result = await createCategory(data);
      }

      if (result.error) {
        // You might want to parse result.fields here for form-specific errors
        throw new Error(result.error);
      }

      toast.success(isEditMode ? "Category updated" : "Category created", {
        description: isEditMode
          ? `The category "${data.name}" has been updated.`
          : `A new category "${data.name}" has been created.`,
      });
      router.push("/admin/categories"); // Redirect to categories list
      router.refresh(); // Refresh server components
    } catch (error: any) {
      toast.error("Uh oh! Something went wrong.", {
        description: error.message || "There was a problem with your request.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., T-Shirts, Dresses" {...field} />
              </FormControl>
              <FormDescription>
                This is the public name for the category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the category."
                  className="resize-none"
                  {...field}
                  value={field.value || ""} // Ensure value is not null
                />
              </FormControl>
              <FormDescription>
                Provide some additional details about this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting 
            ? (isEditMode ? "Saving..." : "Creating...") 
            : (isEditMode ? "Save Changes" : "Create Category")}
        </Button>
      </form>
    </Form>
  );
}
