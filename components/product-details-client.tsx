"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Minus, Package, Plus, Scale, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-provider";
import { RandomProducts } from "@/components/random-products";
import { Separator } from "@/components/ui/separator";

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
  // Added fields to match reference design
  stock?: number;
  reviews?: number;
  viewers?: number;
  features?: string[];
  modelInfo?: string;
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
      price: product.price,
      image: product.image_url || "/placeholder.svg",
      quantity,
    });
  };

  const handleEnquireNow = () => {
    handleAddToCart();
    window.location.href = "/cart";
  };

  // Get the currently selected image
  const imageUrls = product.image_urls || (product.image_url ? [product.image_url] : []);
  const currentImage = imageUrls.length > 0 ? imageUrls[selectedImage] : "/placeholder.svg";

  // Default values for missing fields
  const stock = product.stock || 450;
  const viewers = product.viewers || 30;
  const reviews = product.reviews || 0;
  const features = product.features || [
    "High quality material",
    "Comfortable fit",
    "Durable construction",
    "Stylish design"
  ];
  const modelInfo = product.modelInfo || "Model is 1.84 m wearing size M";
  const material = product.details?.material || "Cotton 100%";
  const care = product.details?.care || "Machine wash, no ironing, don't dry clean, don't tumble dry";

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Thumbnails - Desktop */}
        <div className="hidden md:flex flex-col gap-2 order-1">
          {imageUrls.map((image, index) => (
            <button
              key={index}
              className={`relative w-16 h-16 border ${selectedImage === index ? "border-black" : "border-gray-200"}`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image - Smaller on desktop */}
        <div className="relative aspect-square order-1 md:order-2 mx-auto w-full md:w-[45%] ">
          <Image
            src={currentImage}
            alt={product.name}
            fill
            className="object-contain "
            unoptimized={currentImage.startsWith('/placeholder.svg')}
          />
          {product.isNew && <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 text-xs">NEW</div>}
        </div>

        {/* Thumbnails - Mobile (Now below main image) */}
        <div className="flex md:hidden gap-2 order-2 overflow-x-auto py-4 justify-center">
          {imageUrls.map((image, index) => (
            <button
              key={index}
              className={`relative min-w-[60px] w-[60px] h-[60px] border ${
                selectedImage === index ? "border-black" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Product Details */}
        <div className="md:w-[400px] space-y-6 order-3">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-medium">{product.name}</h1>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            {/* <p className="text-xl font-medium mt-1">${product.price.toFixed(2)}</p> */}
            <p className="text-xl font-medium mt-1">Enquire for price</p>

            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({reviews} reviews)</span>
            </div>

            {/* <div className="flex items-center gap-2 mt-4">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{viewers} people are viewing this right now</span>
            </div> */}

            {/* <div className="flex items-center gap-2 mt-2">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">{stock} in stock</span>
            </div> */}
          </div>

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className="rounded-none h-10"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size} yrs
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
                    className="rounded-none h-10"
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Quantity</h3>
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-none border-gray-300"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <div className="h-10 w-12 flex items-center justify-center border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-none border-gray-300"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <Button className="h-10 flex-1 rounded-none" onClick={handleAddToCart}>
                  Add to cart
                </Button>
              </div>
            </div>

            <Button className="w-full bg-black text-white rounded-none h-12" onClick={handleEnquireNow}>
              Enquire
            </Button>

            {/* <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2">
                <Scale className="h-4 w-4 mr-1" />
                <span className="text-xs">Compare</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2">
                <span className="text-xs">Ask a Question</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500 h-8 px-2">
                <Share2 className="h-4 w-4 mr-1" />
                <span className="text-xs">Share</span>
              </Button>
            </div> */}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Estimated Delivery:</p>
                <p className="text-sm text-gray-500">Store Pickup / 3-5 business days home delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium">Free Shipping & Returns:</p>
                <p className="text-sm text-gray-500">On all orders over 1000.00</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4">
            <p className="text-center text-sm mb-2">Guaranteed safe & secure checkout</p>
            <div className="flex justify-center gap-2">
              <Image src="/card.png?height=30&width=40" alt="Visa" width={40} height={30} />
              <Image src="/visa.png?height=30&width=40" alt="Mastercard" width={40} height={30} />
              <Image src="/google-pay.png?height=30&width=40" alt="JCB" width={40} height={30} />
              </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-16">
        <Tabs defaultValue="product-details">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger
              value="product-details"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              Product details
            </TabsTrigger>
            <TabsTrigger
              value="shipping-returns"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              Shipping & Returns
            </TabsTrigger>
            <TabsTrigger
              value="about-brand"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              About the brand
            </TabsTrigger>
            {/* <TabsTrigger
              value="reviews"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              Reviews
            </TabsTrigger> */}
            <TabsTrigger
              value="questions"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none px-4 py-3 text-sm"
            >
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="product-details" className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-square mx-auto w-full md:w-[60%]">
                <Image 
                  src={imageUrls[0] || "/placeholder.svg"} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  unoptimized={!imageUrls[0] || imageUrls[0].startsWith('/placeholder.svg')}
                />
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-medium mb-4">The Iconic Silhouette</h2>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <h3 className="font-medium mb-3">Information</h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-500 mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div>
                    <h3 className="font-medium mb-3">Composition</h3>
                    <p>{material}</p>

                    <h3 className="font-medium mt-6 mb-3">Wearing</h3>
                    <p>{modelInfo}</p>
                  </div> */}

                  <div className="sm:col-span-2 lg:col-span-1">
                    <h3 className="font-medium mb-3">Washing Instructions</h3>
                    <div className="flex gap-2 mb-4">
                      <div className="w-8 h-8 border flex items-center justify-center">
                        <Image src="/washing-machine.png?height=20&width=20" alt="Wash" width={20} height={20} />
                      </div>
                      <div className="w-8 h-8 border flex items-center justify-center">
                        <Image src="/spin.png?height=20&width=20" alt="No bleach" width={20} height={20} />
                      </div>
                      <div className="w-8 h-8 border flex items-center justify-center">
                        <Image src="/no-iron.png?height=20&width=20" alt="No iron" width={20} height={20} />
                      </div>
                      <div className="w-8 h-8 border flex items-center justify-center">
                        <Image src="/tumble-dry.png?height=20&width=20" alt="No dry clean" width={20} height={20} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{care}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping-returns">
            <div className="py-8">
              <h2 className="text-2xl font-medium mb-4">Shipping & Returns</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Free Standard Shipping</h3>
                  <p className="text-gray-700">On all orders over 1000.00. Delivery time: 3-5 business days.</p>
                </div>
                <div>
                  <h3 className="font-medium">Express Shipping</h3>
                  <p className="text-gray-700">Enquire for price. Delivery time: 2-3 business days.</p>
                </div>
                <div>
                  <h3 className="font-medium">Returns and Exchanges</h3>
                  <p className="text-gray-700">
                    Exchange available within 7 days. Items must be unworn with original tags attached.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="about-brand">
            <div className="py-8">
              <h2 className="text-2xl font-medium mb-4">About the Brand</h2>
              <p className="text-gray-700 mb-4">
                Mushrooms Junior is a brand that offers high-quality, stylish clothing for children. Founded in 2010,
                Mushrooms Junior began with a simple mission: to provide high-quality, stylish clothing that
                empowers people to express themselves through fashion.
              </p>
              <p className="text-gray-700">
                Since 2010, Mushrooms Junior has been at the heart of children's fashion. Their clothing is worn by the best children
                in the world and have become an icon of youth and fashion.
              </p>
            </div>
          </TabsContent>

          {/* <TabsContent value="reviews">
            <div className="py-8 text-center">
              <h2 className="text-2xl font-medium mb-4">Reviews</h2>
              {reviews > 0 ? (
                <div>Reviews content would go here</div>
              ) : (
                <p className="text-gray-500">This product has no reviews yet. Be the first to leave a review!</p>
              )}
            </div>
          </TabsContent> */}

          <TabsContent value="questions">
            <div className="py-8 text-center">
              <h2 className="text-2xl font-medium mb-4">Questions</h2>
              <p className="text-gray-500">Have questions about this product? Ask here and our team will respond.</p>
              <Button className="mt-4">Ask a Question</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products Section - Horizontal scrolling */}
      <div className="mt-16">
        <h2 className="text-2xl font-medium mb-8 text-center">Related products</h2>
        <style jsx global>{`
          @media (max-width: 768px) {
            /* Make cards larger in mobile view */
            .related-products-container .product-card {
              min-width: 85%;
              margin-right: 1rem;
            }
            /* Style for the container */
            .related-products-container {
              display: flex;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              gap: 1rem;
              padding-bottom: 1rem;
              scrollbar-width: none; /* Hide scrollbar for Firefox */
            }
            /* Hide scrollbar for Chrome/Safari/Edge */
            .related-products-container::-webkit-scrollbar {
              display: none;
            }
            /* Make sure items snap into place */
            .related-products-container .product-card {
              scroll-snap-align: start;
            }
          }
        `}</style>
        <div className="related-products-container">
          {product && <RandomProducts 
            excludeProductId={product.id} 
            count={4} 
            title="" 
          />}
        </div>
      </div>
    </div>
  );
}
