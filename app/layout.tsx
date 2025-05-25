import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/sonner"; // Assuming shadcn puts it in components/ui

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mushroom Juniors | Premium Clothing Brand",
  description: "Discover the latest fashion trends with our premium clothing collection",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster richColors />
            </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
