"use client";

import Image from 'next/image'; // Using next/image for optimization is also an option
import { useState } from 'react';

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className = "h-12 w-12 object-cover rounded" }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center text-xs text-gray-500`}>
        No Image
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setHasError(true)}
    />
  );
  // Alternatively, using next/image:
  // return (
  //   <Image
  //     src={src}
  //     alt={alt}
  //     className={className}
  //     width={48} // Corresponds to h-12 w-12, adjust as needed
  //     height={48}
  //     objectFit="cover"
  //     onError={() => setHasError(true)}
  //   />
  // );
}
