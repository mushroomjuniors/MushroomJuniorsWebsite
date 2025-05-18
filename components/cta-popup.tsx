"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={handleClose} aria-label="Close">
          <X className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Get 10% Off Your First Order</h2>
          <p className="mb-6 text-muted-foreground">
            Sign up for our newsletter and receive a 10% discount code for your first purchase.
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleClose()
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="popup-email">Email</Label>
              <Input id="popup-email" type="email" placeholder="your@email.com" required />
            </div>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
              Get My Discount
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            By signing up, you agree to receive marketing emails from us. You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}
