"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, ShoppingBag, Trash, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { toast } from "sonner"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, subtotal, clearCart } = useCart()
  const WHATSAPP_PHONE_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER;

  const handleWhatsAppInquiry = () => {
    if (!WHATSAPP_PHONE_NUMBER) {
      toast.error("WhatsApp number not configured.", {
        description: "The WhatsApp contact number has not been set up correctly.",
      });
      return;
    }
    if (cartItems.length === 0) {
      toast.info("Your cart is empty", {
        description: "Add items to your cart to purchase on WhatsApp.",
      });
      return;
    }
    let message = "I would like to enquire the price of the following products:\n\n";
    cartItems.forEach(item => {
      const productLink = `${window.location.origin}/products/${item.id}`;
      message += `Product Name: ${item.name}\n`;
      message += `Product ID: ${item.id}\n`;
      message += `Product Link: ${productLink}\n\n`;
    });
    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="mt-6">
            <Link href="/store">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-[120px] h-[120px]">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {/* Display selected options if they exist on the item */}
                        {/* Example: item.selectedSize ? `Size: ${item.selectedSize}` : '' */}
                        {/* Example: item.selectedColor ? `, Color: ${item.selectedColor}` : '' */}
                      </p>
                      {/* <p className="font-bold mt-1">${item.price.toFixed(2)}</p> */}
                      {item.price !== undefined ? (
                        <p className="text-xs text-muted-foreground mt-1">Price: Enquire</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">Price not available</p> // Fallback if price is truly undefined
                      )}
                    </div>
                    <div className="flex items-center mt-4 sm:mt-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center">{item.quantity || 1}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Button asChild variant="outline">
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.quantity || 1} ×</span>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    {/* <span className="text-sm font-medium">${(item.price * (item.quantity || 1)).toFixed(2)}</span> */}
                    <span className="text-sm font-medium">Enquire for price</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                {/* <span>${subtotal.toFixed(2)}</span> */}
                <span>To be quoted</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                {/* <span>${subtotal.toFixed(2)}</span> */}
                <span>To be quoted</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-red-600 hover:bg-red-700 flex items-center gap-2"
                onClick={handleWhatsAppInquiry}
                disabled={cartItems.length === 0}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                Purchase on WhatsApp
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
