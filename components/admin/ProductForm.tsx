"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createProduct, updateProduct } from "@/app/admin/products/actions"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { uploadImageToCloudinary } from "@/app/actions/imageUploadActions"

// Simple type for categories passed as props
export interface ProductCategory {
  id: string
  name: string
}

// Zod schema updated for Cloudinary uploads
const productFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters.").max(255),
  description: z.string().max(1000, "Description must not exceed 1000 characters.").optional(),
  price: z.coerce.number().positive("Price must be a positive number."),
  stock_quantity: z.coerce.number().int().min(0, "Stock quantity cannot be negative."),
  category_id: z.string().uuid("A valid category must be selected."),
  // image_url is now for the Cloudinary URL of the primary image
  image_url: z
    .string()
    .url("Invalid URL for primary image. Should be a Cloudinary URL after upload.")
    .optional()
    .or(z.literal("")),
  // image_urls is for the array of Cloudinary URLs for the gallery
  image_urls: z
    .array(z.string().url("Invalid URL for gallery image. Should be a Cloudinary URL after upload."))
    .optional(),
  sizes: z.array(z.enum(["0-1", "1-3", "3-6", "6-9", "9-12", "12-15"])).optional(),
  is_trending: z.boolean().default(false).optional(),
})

export const availableSizes = ["0-1", "1-3", "3-6", "6-9", "9-12", "12-15"] as const

export type ProductFormValues = z.infer<typeof productFormSchema>

interface ProductFormProps {
  // Ensure image_urls and image_url (if it can be null from DB) are correctly typed for initialData
  initialData?: Partial<ProductFormValues> & {
    id?: string
    image_url?: string | null
    image_urls?: string[] | null
    is_trending?: boolean | null
    category_id?: string | null
    name?: string | null
    description?: string | null
    price?: number | null
    stock_quantity?: number | null
    sizes?: string[] | null
  }
  categories: ProductCategory[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const isEditMode = !!initialData?.id

  const [primaryImageFile, setPrimaryImageFile] = useState<File | null>(null)
  const [galleryImageFiles, setGalleryImageFiles] = useState<FileList | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      stock_quantity: initialData?.stock_quantity || 0,
      category_id: initialData?.category_id || "",
      image_url: initialData?.image_url || "", // Will be Cloudinary URL
      image_urls: initialData?.image_urls || [], // Will be Cloudinary URLs
      sizes: initialData?.sizes || [],
      is_trending: initialData?.is_trending || false,
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProductFormValues) {
    setIsUploading(true)
    let processedPrimaryImageUrl = initialData?.image_url || ""
    const existingGalleryImageUrls = initialData?.image_urls || []
    const newUploadedGalleryUrls: string[] = []

    try {
      // Handle primary image upload if a new file is selected
      if (primaryImageFile) {
        processedPrimaryImageUrl = await uploadDirectToCloudinary(primaryImageFile)
      }

      // Handle gallery image uploads if new files are selected
      if (galleryImageFiles && galleryImageFiles.length > 0) {
        for (let i = 0; i < galleryImageFiles.length; i++) {
          const file = galleryImageFiles[i]
          const url = await uploadDirectToCloudinary(file)
          newUploadedGalleryUrls.push(url)
        }
      }

      // Combine and manage gallery URLs
      // Start with the (potentially new) primary image URL if it exists
      const finalGallerySet = processedPrimaryImageUrl ? [processedPrimaryImageUrl] : []
      // Add newly uploaded gallery images
      finalGallerySet.push(...newUploadedGalleryUrls)
      // Add existing gallery images (excluding a potentially updated primary that might already be there,
      // and also excluding any that might have been re-uploaded as part of new gallery images - though unlikely with current setup)
      existingGalleryImageUrls.forEach((url) => {
        if (url !== processedPrimaryImageUrl && !newUploadedGalleryUrls.includes(url)) {
          finalGallerySet.push(url)
        }
      })
      // Ensure uniqueness and filter out empty strings if any slipped through
      const uniqueGalleryUrls = Array.from(new Set(finalGallerySet)).filter((url) => url)

      const finalPayload: ProductFormValues = {
        ...data,
        image_url: processedPrimaryImageUrl,
        image_urls: uniqueGalleryUrls,
      }

      let result
      if (isEditMode && initialData?.id) {
        result = await updateProduct(initialData.id, finalPayload)
      } else {
        result = await createProduct(finalPayload)
      }

      if (result.error) {
        throw new Error(result.error + (result.fields ? ` (${Object.values(result.fields).join(", ")})` : ""))
      }

      toast.success(isEditMode ? "Product updated" : "Product created")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast.error("Operation failed:", {
        description: error.message || "There was a problem with your request.",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Organic Cotton T-Shirt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Select */}
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
                <SelectContent className="max-h-[300px] overflow-y-auto">
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

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the product..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price and Stock Quantity Grid */}
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
        </div>

        {/* Primary Image Upload Field */}
        <FormItem>
          <FormLabel>Primary Image</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setPrimaryImageFile(e.target.files ? e.target.files[0] : null)}
              disabled={isUploading}
            />
          </FormControl>
          <FormDescription>
            Main display image. If you upload a new one, it replaces the current primary image.
          </FormDescription>
          {initialData?.image_url && !primaryImageFile && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Current primary image:</p>
              <img
                src={initialData.image_url || "/placeholder.svg"}
                alt="Current primary"
                className="h-24 w-24 object-cover rounded-md border"
              />
            </div>
          )}
          {primaryImageFile && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">New primary image preview:</p>
              <img
                src={URL.createObjectURL(primaryImageFile) || "/placeholder.svg"}
                alt="New primary preview"
                className="h-24 w-24 object-cover rounded-md border"
              />
            </div>
          )}
        </FormItem>

        {/* Gallery Images Upload Field */}
        <FormItem>
          <FormLabel>Additional Gallery Images</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryImageFiles(e.target.files)}
              disabled={isUploading}
            />
          </FormControl>
          <FormDescription>
            Upload additional images. These will be added to the gallery. The primary image is always included.
          </FormDescription>
          {initialData?.image_urls &&
            initialData.image_urls.filter((url) => url !== initialData.image_url).length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground w-full mb-1">Current additional gallery images:</p>
                <div className="flex flex-wrap gap-2">
                  {initialData.image_urls
                    .filter((url) => url !== initialData.image_url)
                    .map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Current gallery ${index + 1}`}
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    ))}
                </div>
              </div>
            )}
          {galleryImageFiles && galleryImageFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground w-full mb-1">New gallery images preview:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(galleryImageFiles).map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={`New gallery preview ${index + 1}`}
                    className="h-20 w-20 object-cover rounded-md border"
                  />
                ))}
              </div>
            </div>
          )}
        </FormItem>

        {/* Sizes Field */}
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Age Groups</FormLabel>
              <FormDescription>Select all age groups that apply.</FormDescription>
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
                          const currentSizes = field.value || []
                          if (checked) {
                            field.onChange([...currentSizes, size])
                          } else {
                            field.onChange(currentSizes.filter((s) => s !== size))
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel htmlFor={`size-${size}`} className="font-normal cursor-pointer flex-1">
                      {size} yrs
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Trending Checkbox */}
        <FormField
          control={form.control}
          name="is_trending"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Mark as Trending</FormLabel>
                <FormDescription>
                  Trending products will be highlighted in special sections of the store.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || isUploading} className="w-full md:w-auto">
          {isUploading
            ? "Uploading..."
            : form.formState.isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
                ? "Save Changes"
                : "Create Product"}
        </Button>
      </form>
    </Form>
  )
}

async function uploadDirectToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_preset"); // Replace with your preset
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dy0zo3822/image/upload", // Replace with your cloud name
    { method: "POST", body: formData }
  );
  const data = await res.json();
  if (data.secure_url) return data.secure_url;
  throw new Error(data.error?.message || "Cloudinary upload failed");
}
