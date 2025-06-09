"use client"

import { useEffect, useRef } from "react"

export function ScrollTicker() {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tickerElement = tickerRef.current
    if (!tickerElement) return

    const tickerContent = tickerElement.querySelector(".ticker-content")
    if (!tickerContent) return

    // Clone the content to create the infinite effect
    tickerElement.appendChild(tickerContent.cloneNode(true))
  }, [])

  return (
    <div className="relative overflow-hidden bg-black py-2 text-white w-full">
      <div ref={tickerRef} className="ticker-container flex whitespace-nowrap">
        <div className="ticker-content flex animate-marquee">
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="mx-4 flex items-center">
                
                <span className="font-medium">15% OFF ON BIRTHDAY MONTH</span>
                <span className="mx-4 text-red-500">•</span>
                <span className="font-medium">GIFT OFFERS MRP</span>
                <span className="mx-4 text-red-500">•</span>
                <span className="font-medium">PROMOTION OFFERS ON MINIMUM PURCHASE</span>
                <span className="mx-4 text-red-500">•</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
