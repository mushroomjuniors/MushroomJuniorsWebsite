"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export function CTAPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasShownPopup = sessionStorage.getItem("hasShownCTAPopup")

    if (!hasShownPopup) {
      // Set a timeout to show the popup after 5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Mark that we've shown the popup in this session
        sessionStorage.setItem("hasShownCTAPopup", "true")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[1040px] rounded-lg bg-white p-0 shadow-lg flex flex-col items-center justify-center">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-center w-full h-full p-0">
          <Image
            src="/cta-popup2.png"
            alt="Special Offer"
            width={1040}
            height={520}
            className="rounded-lg object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
