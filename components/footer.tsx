import Link from "next/link"
import { Facebook, Instagram, Twitter, Truck, CreditCard, RefreshCw, Headphones } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      {/* Services section */}
      <div className="container px-4 py-8 mx-auto border-b border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Free Shipping</h3>
              <p className="text-sm text-white/70">Free Shipping for orders over ₹1000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <RefreshCw className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Money Guarantee</h3>
              <p className="text-sm text-white/70">Within 7 days for an exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Headphones className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Online Support</h3>
              <p className="text-sm text-white/70">24 hours a day, 7 days a week</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="font-bold">Flexible Payment</h3>
              <p className="text-sm text-white/70">Pay with Multiple Payment Methods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <img src="/logo2n.png" alt="Mushroom Junior Logo" className="h-16 w-auto" />
            <p className="text-sm text-white/70">
              Find a location nearest you.
              <br />
              See Our Stores
            </p>
            <p className="text-sm text-white/70">+91 9116999844</p>
            <p className="text-sm text-white/70">mushroomjuniors@gmail.com</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/store" className="text-white/70 hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-white/70 hover:text-white">
                  Cart
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white">
                  Contact
                </Link>
              </li>
              {/* <li>
                <Link href="/checkout" className="text-white/70 hover:text-white">
                  Checkout
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/careers" className="text-white/70 hover:text-white">
                  Careers
                </Link>
              </li> */}
              {/* <li>
                <Link href="/delivery-info" className="text-white/70 hover:text-white">
                  Delivery Information
                </Link>
              </li> */}
              <li>
                <Link href="/privacy-policy" className="text-white/70 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white">
                  Terms & Condition
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            {/* Empty column for layout symmetry */}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 mt-8 md:flex-row">
          <div className="flex gap-2">
            <img src="/visa-white.png?height=30&width=50" alt="American Express" className="h-10" />
            <img src="/mastercard-white.png?height=30&width=50" alt="Mastercard" className="h-8 pt-2" />
            <img src="/google-pay-white.png?height=30&width=50" alt="Google-pay" className="h-10" />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} Mushrooms Junior. All rights reserved.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="https://www.instagram.com/mushroomjuniors?igsh=YXBrcWRvdnpxMmFh" className="text-white/70 hover:text-white">
              <Instagram className="h-5 w-5 text-white" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
