"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    image: "/heroimage.avif?height=1080&width=1920",
    title: "Inspiring style",
    description: "Discover our latest styles crafted with premium materials.",
    button: { label: "Shop Now", href: "/store" }
  },
  {
    image: "/heroimg-2.jpg?height=1080&width=1920",
    title: "New Arrivals",
    description: "Check out the freshest looks for the season.",
    button: { label: "Browse Collection", href: "/store" }
  },
  {
    image: "/heroimg-3.jpg?height=1080&width=1920",
    title: "Timeless Comfort",
    description: "Experience comfort and style like never before.",
    button: { label: "See More", href: "/store" }
  }
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = () => setCurrent((current + 1) % slides.length);
  const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left
      nextSlide();
    } else if (distance < -50) {
      // Swiped right
      prevSlide();
    }
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden max-w-full"
      onTouchStart={(e) => handleTouchStart(e.nativeEvent)}
      onTouchMove={(e) => handleTouchMove(e.nativeEvent)}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{ maxWidth: "100vw" }}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-black/60 to-black/30" />
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('${slide.image}')`,
              maxWidth: "100vw"
            }}
          />
          <div className="relative h-full flex items-center w-full">
            <div className="container px-4 mx-auto w-full max-w-full">
              <div className="max-w-lg space-y-6 text-white">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-black text-white ">
                    <Link href={slide.button.href}>{slide.button.label}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full p-2 hover:bg-black/70"
        aria-label="Previous Slide"
      >
        &#8592;
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 text-white rounded-full p-2 hover:bg-black/70"
        aria-label="Next Slide"
      >
        &#8594;
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${idx === current ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
