import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script'; // 👈 Import Script component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mushroom Juniors | Premium Clothing Brand",
  description: "Discover the latest fashion trends with our premium clothing collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Google Tag Manager Script */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-NN0XXJC8SK"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NN0XXJC8SK');
            `}
          </Script>
        </head>
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
  );
}
