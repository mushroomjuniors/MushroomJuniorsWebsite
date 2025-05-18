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
import { useState } from "react";
import { uploadImageToCloudinary } from "@/app/actions/imageUploadActions";

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }).max(100, {
    message: "Category name must not be longer than 100 characters.",
  }),
  description: z.string().max(500, {
    message: "Description must not be longer than 500 characters.",
  }).optional(),
  image_url: z.string().url({ message: "Please enter a valid image URL."}).optional().or(z.literal('')),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: Partial<CategoryFormValues> & { id?: string; image_url?: string | null };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData?.id;

  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      image_url: initialData?.image_url || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: CategoryFormValues) {
    setIsUploading(true);
    let finalImageUrl = initialData?.image_url || "";

    try {
      if (categoryImageFile) {
        const formData = new FormData();
        formData.append("file", categoryImageFile);
        const uploadResult = await uploadImageToCloudinary(formData);

        if (uploadResult.success && uploadResult.url) {
          finalImageUrl = uploadResult.url;
        } else {
          throw new Error(uploadResult.error || "Category image upload failed.");
        }
      }

      const finalData = {
        ...data,
        image_url: finalImageUrl,
      };

      let result;
      if (isEditMode && initialData?.id) {
        result = await updateCategory(initialData.id, finalData);
      } else {
        result = await createCategory(finalData);
      }

      if (result.error) {
        throw new Error(result.error  + (result.fields ? ` (${Object.values(result.fields).join(', ')})` : ''));
      }

      toast.success(isEditMode ? "Category updated" : "Category created", {
        description: isEditMode
          ? `The category "${data.name}" has been updated.`
          : `A new category "${data.name}" has been created.`,
      });
      router.push("/admin/categories");
      router.refresh();
    } catch (error: any) {
      toast.error("Operation failed:", {
        description: error.message || "There was a problem with your request.",
      });
    } finally {
      setIsUploading(false);
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
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                Provide some additional details about this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Category Image</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setCategoryImageFile(e.target.files ? e.target.files[0] : null)}
              disabled={isUploading}
            />
          </FormControl>
          <FormDescription>
            Upload an image for the category. Replaces the current image if one exists.
          </FormDescription>
          {initialData?.image_url && !categoryImageFile && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Current image:</p>
              <img src={initialData.image_url} alt="Current category" className="h-24 w-24 object-cover rounded-md border" />
            </div>
          )}
          {categoryImageFile && (
             <div className="mt-2">
              <p className="text-sm text-muted-foreground">New image preview:</p>
              <img src={URL.createObjectURL(categoryImageFile)} alt="New category preview" className="h-24 w-24 object-cover rounded-md border" />
            </div>
          )}
          <FormMessage>{form.formState.errors.image_url?.message}</FormMessage>
        </FormItem>

        <Button type="submit" disabled={form.formState.isSubmitting || isUploading}>
          {isUploading ? "Uploading..." : (form.formState.isSubmitting 
            ? (isEditMode ? "Saving..." : "Creating...") 
            : (isEditMode ? "Save Changes" : "Create Category"))}
        </Button>
      </form>
    </Form>
  );
}
