"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Menu, Search, ShoppingCart, User, X, ChevronDown } from 'lucide-react'
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
import { createClient } from "@supabase/supabase-js"

// Helper function to generate a simple slug
const generateSlug = (name: string) => {
  if (!name) return '';
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const menSubCategories = [
 
  { title: "Indo Western" },
  { title: "Blazers" },
  { title: "Sherwani" },
  { title: "Suit" },
  { title: "Boys Jeans" },
  { title: "Boys Shirts" },
  { title: "Boys T-Shirts" },
  { title: "Casual-Wear" },
  { title: "Boys Jackets" },
  { title: "3/4 Denims" },
  { title: "Tuxedos" },
  { title: "Lowers" },
];
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
const womenSubCategories = [
  { title: "Western Dress" },
  { title: "Ethnic" },
  { title: "Frocks" },
  { title: "Gowns" },
  { title: "Midis" },
  { title: "Jeans" },
  { title: "Leggings" },
  { title: "Lowers" },
  { title: "Jackets" },
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

  type Category = { id: string; name: string; slug: string; gender: string };
  const [categories, setCategories] = useState<Category[]>([])

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

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("id, name, slug, gender");
      if (!error) setCategories(data || []);
    }
    fetchCategories();
  }, [])

  const boysCategories = categories.filter((cat) => cat.gender === "boys");
  const girlsCategories = categories.filter((cat) => cat.gender === "girls");
  const unisexCategories = categories.filter((cat) => cat.gender === "unisex");

  const headerClasses = isHomePage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black border-b border-gray-800" : "bg-transparent"}`
    : "sticky top-0 z-50 w-full border-b border-gray-800 bg-black"

  const textColor = "text-white" // Always white as background is transparent or black
  const iconColor = "text-white" // Always white
  const navLinkHoverBg = "hover:bg-gray-200/40 hover:text-white focus:bg-gray-200/40 focus:text-white data-[active]:bg-gray-200/40 data-[active]:text-white"

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
                    Boys
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pr-3 pb-1 pt-0">
                    <nav className="flex flex-col gap-1 mt-1">
                      {boysCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="block text-base py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </nav>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="women-category" className="border-b-0">
                  <AccordionTrigger className={`text-lg font-medium py-2 px-3 hover:no-underline hover:bg-muted rounded-md flex justify-between items-center w-full`}>
                    Girls
                  </AccordionTrigger>
                  <AccordionContent className="pl-6 pr-3 pb-1 pt-0">
                    <nav className="flex flex-col gap-1 mt-1">
                      {girlsCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          className="block text-base py-2 px-3 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                          {cat.name}
                        </Link>
                      ))}
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
          <img
            src={isHomePage && !scrolled ? "/logo0n.png" : "/logo2n.png"}
            alt="Mushroom Junior Logo"
            className="h-10 w-auto"
          />
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

            {/* Boys Dropdown (Dynamic) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${textColor} bg-transparent ${navLinkHoverBg} font-medium`}>
                Boys
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex gap-4 p-4 md:w-[500px] lg:w-[700px]">
                  <div className="relative flex flex-col justify-end rounded-md overflow-hidden min-w-[180px] max-w-[220px] w-full h-[220px]">
                    <a
                      className="absolute inset-0"
                      href="/"
                      style={{
                        backgroundImage: "url('/boys-bg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 p-6">
                      <div className="mb-2 mt-2 text-lg font-medium text-white">
                        Boys Collection
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Curated collection of boys wear
                      </p>
                    </div>
                  </div>
                  <ul
                    className="grid gap-3 flex-1 h-[220px] overflow-y-auto pr-2"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      alignContent: "start",
                    }}
                  >
                    {boysCategories.map((cat) => (
                      <li key={cat.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/products?category=${cat.slug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                          >
                            <div className="text-sm font-medium leading-none">{cat.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Girls Dropdown (Dynamic) */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={`${textColor} bg-transparent ${navLinkHoverBg} font-medium`}>
                Girls
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="flex gap-4 p-4 md:w-[500px] lg:w-[700px]">
                  <div className="relative flex flex-col justify-end rounded-md overflow-hidden min-w-[180px] max-w-[220px] w-full h-[220px]">
                    <a
                      className="absolute inset-0"
                      href="/"
                      style={{
                        backgroundImage: "url('/girls-bg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 p-6">
                      <div className="mb-2 mt-2 text-lg font-medium text-white">
                        Girls Collection
                      </div>
                      <p className="text-sm leading-tight text-white/90">
                        Curated collection of girls wear
                      </p>
                    </div>
                  </div>
                  <ul
                    className="grid gap-3 flex-1 h-[220px] overflow-y-auto pr-2"
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      alignContent: "start",
                    }}
                  >
                    {girlsCategories.map((cat) => (
                      <li key={cat.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/products?category=${cat.slug}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-left"
                          >
                            <div className="text-sm font-medium leading-none ">{cat.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
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