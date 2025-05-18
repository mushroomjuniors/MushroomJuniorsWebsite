import Link from "next/link"
import { Facebook, Instagram, Twitter, Truck, CreditCard, RefreshCw, Headphones } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      {/* Services section */}
      <div className="container px-4 py-8 mx-auto border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Truck className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-bold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free Shipping for orders over ₹1000</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <RefreshCw className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-bold">Money Guarantee</h3>
              <p className="text-sm text-muted-foreground">Within 7 days for an exchange</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <Headphones className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-bold">Online Support</h3>
              <p className="text-sm text-muted-foreground">24 hours a day, 7 days a week</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <CreditCard className="h-10 w-10" />
            </div>
            <div>
              <h3 className="font-bold">Flexible Payment</h3>
              <p className="text-sm text-muted-foreground">Pay with Multiple Payment Methods</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Mushrooms Junior</h3>
            <p className="text-sm text-muted-foreground">
              Find a location nearest you.
              <br />
              See Our Stores
            </p>
            <p className="text-sm text-muted-foreground">+91 9829000000</p>
            <p className="text-sm text-muted-foreground">info@mushroomjunior.com</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Explore</h3>
            <ul className="space-y-2 text-sm">
            <li>
                <Link href="/store" className="text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="text-muted-foreground hover:text-foreground">
                    Men
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-muted-foreground hover:text-foreground">
                    Women
                </Link>
              </li>
              <li>
                <Link href="/products?category=children" className="text-muted-foreground hover:text-foreground">
                    Children
                </Link>
              </li>
              
              {/* <li>
                <Link href="/checkout" className="text-muted-foreground hover:text-foreground">
                  Checkout
                </Link>
              </li> */}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              {/* <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li> */}
              {/* <li>
                <Link href="/delivery-info" className="text-muted-foreground hover:text-foreground">
                  Delivery Information
                </Link>
              </li> */}
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms & Condition
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-bold">Subscribe</h3>
            <p className="text-sm text-muted-foreground">
              Enter your email below to be the first to know about new collections and product launches.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your Email" className="flex-1" />
              <Button type="submit" variant="outline">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 mt-8 md:flex-row">
          <div className="flex gap-2">
            <img src="/visa.png?height=30&width=50" alt="American Express" className="h-8" />
            <img src="/card.png?height=30&width=50" alt="Google Pay" className="h-8" />
            <img src="/google-pay.png?height=30&width=50" alt="Mastercard" className="h-8" />
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Mushrooms Junior. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
