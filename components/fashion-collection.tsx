import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Plus, ShoppingCart } from "lucide-react"

// Define types for the product data
export type Product = {
  id: string
  name: string
  price: number
  image: string
}

// Define types for the collection data
export type Collection = {
  title: string
  description: string
  backgroundImage: string
  products: Product[]
}

// Define props for the component
export type FashionCollectionProps = {
  womenCollection: Collection
  menCollection: Collection
  className?: string
}

export const FashionCollection: React.FC<FashionCollectionProps> = ({
  womenCollection,
  menCollection,
  className = "",
}) => {
  return (
    <div className={`fashion-collection ${className}`}>
      {/* Women's Collection Section */}
      <section className="flex flex-col lg:flex-row min-h-screen">
        {/* Left sticky half - Women Category */}
        <div className="w-full lg:w-1/2 bg-black text-white lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="absolute inset-0 opacity-30">
            <Image
              src={womenCollection.backgroundImage || "/woman-bg.png"}
              alt={`${womenCollection.title} Background`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <h1 className="text-5xl lg:text-7xl font-light mb-6 tracking-tight leading-tight">
              {womenCollection.title.split(" ")[0]}
              <br />
              {womenCollection.title.split(" ")[1]}
            </h1>
            <p className="text-sm text-gray-400 mt-16 max-w-sm leading-relaxed">{womenCollection.description}</p>
          </div>
        </div>

        {/* Right scrollable half - Women Products */}
        <div className="w-full lg:w-1/2 bg-black text-white p-8 lg:p-16 flex flex-col">
          <div className="flex items-center mb-8">
            <Plus className="w-6 h-6 mr-4" />
            <div>
              <h2 className="text-3xl lg:text-5xl font-light tracking-tight">Top Picks</h2>
              <p className="text-sm text-gray-400 mt-4">2023 - 2024 COLLECTION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            {womenCollection.products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-black mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                <div className="relative aspect-square bg-gray-200 group">
                  <Image
                    src={product.image || "/product-sunglasses.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <button className="flex items-center justify-between w-full bg-black bg-opacity-80 text-white px-4 py-3">
                      <span>QUICK SHOP</span>
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900">
                  <h3 className="text-sm uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-16">
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-none hover:bg-zinc-800 transition-colors"
            >
              VIEW ALL COLLECTION <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Men's Collection Section - Reversed Layout */}
      <section className="flex flex-col lg:flex-row-reverse min-h-screen">
        {/* Right sticky half - Men Category */}
        <div className="w-full lg:w-1/2 bg-black text-white lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="absolute inset-0 opacity-30">
            <Image
              src={menCollection.backgroundImage || "/man-bg.png"}
              alt={`${menCollection.title} Background`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-md mx-auto lg:mx-0">
            <h1 className="text-5xl lg:text-7xl font-light mb-6 tracking-tight leading-tight">
              {menCollection.title.split(" ")[0]}
              <br />
              {menCollection.title.split(" ")[1]}
            </h1>
            <p className="text-sm text-gray-400 mt-16 max-w-sm leading-relaxed">{menCollection.description}</p>
          </div>
        </div>

        {/* Left scrollable half - Men Products */}
        <div className="w-full lg:w-1/2 bg-black text-white p-8 lg:p-16 flex flex-col">
          <div className="flex items-center mb-8">
            <Plus className="w-6 h-6 mr-4" />
            <div>
              <h2 className="text-3xl lg:text-5xl font-light tracking-tight">Top Picks</h2>
              <p className="text-sm text-gray-400 mt-4">2023 - 2024 COLLECTION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            {menCollection.products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-black mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                <div className="relative aspect-square bg-gray-200 group">
                  <Image
                    src={product.image || "/product-shield.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <button className="flex items-center justify-between w-full bg-black bg-opacity-80 text-white px-4 py-3">
                      <span>QUICK SHOP</span>
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-zinc-900">
                  <h3 className="text-sm uppercase tracking-wide">{product.name}</h3>
                  <p className="text-sm">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-16">
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-none hover:bg-zinc-800 transition-colors"
            >
              VIEW ALL COLLECTION <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Default export for easier imports
export default FashionCollection
