"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, Share2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useState } from "react";
import { useRouter } from 'next/navigation';

// Product interface (matches the one previously in product-grid.tsx)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountText?: string;
  image_url?: string | null;
  image_urls?: string[] | null;
  category?: string | null;
  isNew?: boolean | null;
  // Add any other fields your ProductCard might eventually need from the full product type
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isCardHovered, setIsCardHovered] = useState(false);
  const router = useRouter();

  const primaryImageUrl = product.image_url || 
                        (product.image_urls && product.image_urls[0]) || 
                        "/placeholder.svg?width=300&height=300&text=Image+Not+Found";
  
  const secondaryImageUrl = (product.image_urls && product.image_urls.length > 1 && product.image_urls[1])
                            ? product.image_urls[1]
                            : primaryImageUrl;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: primaryImageUrl,
      quantity: 1,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${product.id}`);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}/products/${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: productUrl,
        });
      } catch (error) {
        console.error('Error sharing product:', error);
        navigator.clipboard.writeText(productUrl).then(() => {
          alert('Link copied to clipboard!');
        }).catch(err => {
          alert('Could not copy link. Please share manually.');
        });
      }
    } else {
      navigator.clipboard.writeText(productUrl).then(() => {
        alert('Link copied to clipboard!');
      }).catch(err => {
        alert('Could not copy link. Please share manually.');
      });
    }
  };

  return (
    <Card
      className="py-0 group/card relative rounded-2xl overflow-visible border-none transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-white shadow-xl transition-opacity duration-300 ease-in-out z-0"
        style={{
          opacity: isCardHovered ? 1 : 0,
        }}
      />
      <div className="relative z-[1] flex flex-col h-full p-3 bg-card group-hover/card:scale-110 group-hover/card:bg-gray-50 dark:group-hover/card:bg-gray-800 transition-all duration-300 ease-in-out rounded-2xl">
        <div className="relative aspect-square w-full overflow-hidden group/image">
          <Link href={`/products/${product.id}`} passHref className="block absolute inset-0">
            <Image
              src={primaryImageUrl}
              alt={`${product.name} - primary`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover rounded-2xl transition-opacity duration-500 ease-in-out ${
                isCardHovered && secondaryImageUrl !== primaryImageUrl ? 'opacity-0' : 'opacity-100'
              }`}
              priority={false}
            />
            {secondaryImageUrl !== primaryImageUrl && (
              <Image
                src={secondaryImageUrl}
                alt={`${product.name} - secondary`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover rounded-2xl transition-opacity duration-500 ease-in-out ${
                  isCardHovered ? 'opacity-100' : 'opacity-0'
                }`}
                priority={false}
              />
            )}
          </Link>
          <div
            className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none"
          >
            <div className="bg-white rounded-md shadow-md p-1.5 flex items-center gap-1 pointer-events-auto">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm" onClick={handleQuickView} title="Quick View">
                <Eye className="h-4 w-4" /> <span className="sr-only">Quick View</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm" onClick={handleAddToCart} title="Add to cart">
                <ShoppingCart className="h-4 w-4" /> <span className="sr-only">Add to Cart</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm" onClick={handleShare} title="Share">
                <Share2 className="h-4 w-4" /> <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="p-2 text-center mt-auto">
          <Link href={`/products/${product.id}`} className="hover:underline">
            <h3 className="font-semibold text-xs text-gray-800 leading-tight truncate" title={product.name}>
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-600 mt-1">
            {product.price ? `$${product.price.toFixed(2)}` : "Enquire for price"}
          </p>
        </div>
      </div>
    </Card>
  );
} 