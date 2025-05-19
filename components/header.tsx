"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingCart, User, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Helper function to generate a simple slug
const generateSlug = (name: string) => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const menSubCategories = [
  { title: "Men Party Wear" },
  { title: "3/4 Denims" },
  { title: "Blazers" },
  { title: "Indo Western" },
  { title: "Men Jackets" },
  { title: "Men's Jeans" },
  { title: "Men's Shirts" },
  { title: "Men's T-Shirts" },
  { title: "Sherwani" },
  { title: "Suit" },
  { title: "Tuxedos" },
  { title: "Lowers" },
];

const womenSubCategories = [
  { title: "Dungree" },
  { title: "Ethnic" },
  { title: "Frocks" },
  { title: "Gowns" },
  { title: "Jackets" },
  { title: "Jeans" },
  { title: "Leggings" },
  { title: "Lowers" },
  { title: "Midis" },
  { title: "Party Tops" },
  { title: "Shorts" },
  { title: "Toppers" },
  { title: "T-Shirts" },
];

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartItems } = useCart()
  const cartItemCount = cartItems.length
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll)
      // Set initial scrolled state for homepage based on current scroll position
      handleScroll(); 
    } else {
      setScrolled(true) // Non-home pages always have the "scrolled" look
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isHomePage])

  const headerClasses = isHomePage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black border-b border-gray-800" : "bg-transparent"}`
    : "sticky top-0 z-50 w-full border-b border-gray-800 bg-black"

  const textColor = "text-white" // Always white as background is transparent or black
  const iconColor = "text-white" // Always white
  const navLinkHoverBg = "hover:bg-gray-200/40 focus:bg-gray-200/40 data-[active]:bg-gray-200/40"

  return (
    <header className={headerClasses}>
      <div className="container flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className={`md:hidden ${iconColor}`}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
            <nav className="flex flex-col gap-1 mt-8">
              <Link href="/" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted">
                Home
              </Link>
              <Link href="/store" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted">
                All Products
              </Link>

              <Accordion type="multiple" className="w-full">
                <AccordionItem value="men-category" className="border-b-0">
                  <AccordionTrigger className={`text-lg font-medium py-2 px-3 hover:no-underline hover:bg-muted rounded-md flex justify-between items-center w-full`}>
                    Men
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pr-3 pb-1 pt-0">
                    <nav className="flex flex-col gap-1 mt-1">
                      {menSubCategories.map((subCategory) => {
                        const categorySlug = generateSlug(subCategory.title);
                        return (
                          <Link
                            key={subCategory.title}
                            href={`/products?category=${categorySlug}`}
                            className="block text-base py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            {subCategory.title}
                          </Link>
                        );
                      })}
                    </nav>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="women-category" className="border-b-0">
                  <AccordionTrigger className={`text-lg font-medium py-2 px-3 hover:no-underline hover:bg-muted rounded-md flex justify-between items-center w-full`}>
                    Women
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pr-3 pb-1 pt-0">
                    <nav className="flex flex-col gap-1 mt-1">
                      {womenSubCategories.map((subCategory) => {
                        const categorySlug = generateSlug(subCategory.title);
                        return (
                          <Link
                            key={subCategory.title}
                            href={`/products?category=${categorySlug}`}
                            className="block text-base py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            {subCategory.title}
                          </Link>
                        );
                      })}
                    </nav>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link href="/about" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted">
                About
              </Link>
              <Link href="/contact" className="text-lg font-medium py-2 px-3 rounded-md hover:bg-muted">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className={`ml-4 md:ml-0 flex items-center gap-2 ${textColor}`}>
          <span className="text-xl font-bold">Mushrooms Junior</span>
        </Link>

        <NavigationMenu className="mx-6 hidden md:flex items-center gap-6 text-sm">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${textColor} bg-transparent ${navLinkHoverBg}`}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/store" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${textColor} bg-transparent ${navLinkHoverBg}`}>
                  All Products
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            
            {/* Men Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${textColor} bg-transparent ${navLinkHoverBg} font-medium`}>
                Men
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px]">
                  {menSubCategories.map((subCategory) => {
                    const categorySlug = generateSlug(subCategory.title);
                    return (
                      <li key={subCategory.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/products?category=${categorySlug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{subCategory.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Women Dropdown Placeholder */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${textColor} bg-transparent ${navLinkHoverBg} font-medium`}>
                Women
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px]">
                  {womenSubCategories.map((subCategory) => {
                    const categorySlug = generateSlug(subCategory.title);
                    return (
                      <li key={subCategory.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/products?category=${categorySlug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{subCategory.title}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${textColor} bg-transparent ${navLinkHoverBg}`}>
                  About
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact" legacyBehavior passHref>
                <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${textColor} bg-transparent ${navLinkHoverBg}`}>
                  Contact
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          {/* {isSearchOpen ? (
            <div className="relative flex items-center">
              <Input type="search" placeholder="Search products..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className={iconColor} onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className={iconColor}>
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Button> */}

          <Link href="/cart">
            <Button variant="ghost" size="icon" className={`relative ${iconColor}`}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                  {cartItemCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
