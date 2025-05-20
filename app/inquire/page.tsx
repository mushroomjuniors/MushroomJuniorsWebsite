"use client"

import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MessageSquare } from "lucide-react"

export default function InquirePage() {
  const { cartItems } = useCart()
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
        description: "Add items to your cart to inquire on WhatsApp.",
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

  return (
    <div className="container px-4 py-12 mx-auto max-w-md flex flex-col items-center justify-center min-h-[60vh]">
      <Button
        onClick={handleWhatsAppInquiry}
        disabled={cartItems.length === 0}
        size="lg"
        className="flex items-center gap-2 text-lg"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        Inquire on WhatsApp
      </Button>
      {cartItems.length === 0 && (
        <p className="mt-4 text-red-600 text-sm">Please add items to your cart before sending an inquiry.</p>
      )}
    </div>
  )
}
