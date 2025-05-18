"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-provider";
import { RandomProducts } from "@/components/random-products";

// This will be the refined Product type based on Supabase
export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  image_url?: string | null; // Main image
  image_urls?: string[] | null; // Gallery images
  sizes?: string[] | null;
  colors?: string[] | null;
  details?: { [key: string]: string } | null;
  isNew?: boolean;
  // category_name?: string; // For breadcrumbs, if fetched
}

interface ProductDetailsClientProps {
  product: Product | null;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState(0);

  const { addToCart } = useCart();

  useEffect(() => {
    // Reset selections if product changes
    setSelectedSize(product?.sizes?.[0] || undefined);
    setSelectedColor(product?.colors?.[0] || undefined);
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  if (!product) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Basic validation: ensure size and color are selected if options exist
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size.");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price, // Price is present for type consistency, cart will handle display/enquiry
      image: product.image_url || "/placeholder.svg",
      quantity,
      // You might want to add selectedSize and selectedColor to the cart item
      // category: product.category_name || "", // Example
      // isNew needs to be handled if CartProvider expects it
    });
  };

  const currentImage = 
    product.image_urls && product.image_urls.length > selectedImage 
      ? product.image_urls[selectedImage] 
      : product.image_url || "/placeholder.svg";

  return (
    <>
      <div className="container px-4 py-12 mx-auto">
        {/* Breadcrumbs - can be enhanced */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized={currentImage.startsWith('/placeholder.svg')} // Avoid optimizing placeholders
              />
              {product.isNew && <Badge className="absolute top-4 right-4">New</Badge>}
            </div>
            {product.image_urls && product.image_urls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.image_urls.map((imgUrl, index) => (
                  <button
                    key={index}
                    className={`relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={imgUrl || "/placeholder.svg"}
                      alt={`${product.name} - Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={imgUrl?.startsWith('/placeholder.svg')}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info & Actions */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-xl font-semibold mt-2 text-gray-700 dark:text-gray-300">Enquire for price</p>
            </div>

            {product.description && <p className="text-muted-foreground">{product.description}</p>}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      // Consider adding color swatches if your colors are hex codes
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button size="lg" className="flex-grow" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
            </div>

            {/* Product Details Tabs */}
            {(product.details || product.description) && (
               <Tabs defaultValue="description" className="w-full">
                <TabsList>
                  {product.description && <TabsTrigger value="description">Description</TabsTrigger>}
                  {product.details && <TabsTrigger value="details">Details</TabsTrigger>}
                </TabsList>
                {product.description && (
                  <TabsContent value="description">
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </TabsContent>
                )}
                {product.details && (
                  <TabsContent value="details">
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {Object.entries(product.details).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium text-foreground">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </TabsContent>
                )}
              </Tabs>
            )}
          </div>
        </div>
      </div>
      
      {/* Random Products Section (Trending Products) */}
      {product && <RandomProducts excludeProductId={product.id} count={4} title="Trending Now" />}
    </>
  );
}
