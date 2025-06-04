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
  link: string
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
        <div className="w-full lg:w-1/2 bg-neutral-950 text-neutral-200 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="absolute inset-0 opacity-25">
            <Image
              src={womenCollection.backgroundImage || "/girls-collections.webp"}
              alt={`${womenCollection.title} Background`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <h1 className="text-5xl lg:text-7xl font-light mb-6 tracking-normal lg:tracking-wide leading-tight">
              {womenCollection.title.split(" ")[0]}
              <br />
              {womenCollection.title.split(" ")[1]}
            </h1>
            <p className="text-sm text-neutral-400 mt-16 max-w-sm leading-relaxed">{womenCollection.description}</p>
          </div>
        </div>

        {/* Right scrollable half - Women Products */}
        <div className="w-full lg:w-1/2 bg-neutral-950 text-neutral-200 p-8 lg:p-16 flex flex-col">
          <div className="flex items-center mb-8">
            <Plus className="w-6 h-6 mr-4 text-neutral-300" />
            <div>
              <h2 className="text-3xl lg:text-5xl font-light tracking-normal lg:tracking-wide">Top Picks</h2>
              <p className="text-sm text-neutral-400 mt-4">2025 COLLECTION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            {womenCollection.products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-neutral-900 mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 rounded-lg overflow-hidden shadow-xl">
                <div className="relative aspect-square bg-neutral-800 group">
                  <Image
                    src={product.image || "/product-sunglasses.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <Link href={product.link}
                    className="flex items-center justify-between w-full bg-black bg-opacity-70 text-white px-4 py-3 rounded-md hover:bg-opacity-80 transition-all">
                      <span>VIEW PRODUCTS</span>
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 bg-neutral-850 ">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-[#a71e21]">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-16">
            <Link
              href="store"
              className="inline-flex items-center gap-2 bg-neutral-800 text-neutral-100 px-8 py-4 rounded-sm hover:bg-neutral-700 transition-colors text-sm uppercase tracking-wider"
            >
              VIEW ALL COLLECTION <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Men's Collection Section - Reversed Layout */}
      <section className="flex flex-col lg:flex-row-reverse min-h-screen">
        {/* Right sticky half - Men Category */}
        <div className="w-full lg:w-1/2 bg-neutral-950 text-neutral-200 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center p-8 lg:p-16 relative">
          <div className="absolute inset-0 opacity-25">
            <Image
              src={menCollection.backgroundImage || "/boys-collections.webp"}
              alt={`${menCollection.title} Background`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 max-w-md mx-auto lg:mx-0">
            <h1 className="text-5xl lg:text-7xl font-light mb-6 tracking-normal lg:tracking-wide leading-tight">
              {menCollection.title.split(" ")[0]}
              <br />
              {menCollection.title.split(" ")[1]}
            </h1>
            <p className="text-sm text-neutral-400 mt-16 max-w-sm leading-relaxed">{menCollection.description}</p>
          </div>
        </div>

        {/* Left scrollable half - Men Products */}
        <div className="w-full lg:w-1/2 bg-neutral-950 text-neutral-200 p-8 lg:p-16 flex flex-col">
          <div className="flex items-center mb-8">
            <Plus className="w-6 h-6 mr-4 text-neutral-300" />
            <div>
              <h2 className="text-3xl lg:text-5xl font-light tracking-normal lg:tracking-wide">Top Picks</h2>
              <p className="text-sm text-neutral-400 mt-4">2025 COLLECTION</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-8">
            {menCollection.products.slice(0, 3).map((product) => (
              <div key={product.id} className="bg-neutral-900 mx-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2 rounded-lg overflow-hidden shadow-xl">
                <div className="relative aspect-square bg-neutral-800 group">
                  <Image
                    src={product.image || "/product-shield.png"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <Link href={product.link} className="flex items-center justify-between w-full bg-black bg-opacity-70 text-white px-4 py-3 rounded-md hover:bg-opacity-80 transition-all">
                      <span>VIEW PRODUCTS</span>
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                <div className="p-4 bg-neutral-[#a71e21]">
                  <h3 className="text-sm uppercase tracking-wider font-bold text-white">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-16">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 bg-neutral-800 text-neutral-100 px-8 py-4 rounded-sm hover:bg-neutral-700 transition-colors text-sm uppercase tracking-wider"
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
