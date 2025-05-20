"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { ChevronLeft, Mail, MapPin, Phone, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useCart } from "@/components/cart-provider"
import { createInquiry } from "@/app/actions/inquiryActions"
import { inquiryFormSchema, type InquiryFormValues } from "@/lib/types/inquiryTypes"

export default function InquirePage() {
  const { cartItems, subtotal, clearCart } = useCart()

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "Inquiry about items in cart",
      message: "",
      cartItems: [],
    },
  })

  const { handleSubmit, control, formState: { isSubmitting, isSubmitSuccessful }, reset } = form

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
      // Assumption: Product links follow the pattern /products/[itemID]
      // Adjust if your actual product URL structure is different.
      const productLink = `${window.location.origin}/products/${item.id}`;
      message += `Product Name: ${item.name}\n`;
      message += `Product ID: ${item.id}\n`; // Assuming item.id is suitable for display and linking
      message += `Product Link: ${productLink}\n\n`;
    });

    const encodedMessage = encodeURIComponent(message.trim());
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const onSubmit = async (data: InquiryFormValues) => {
    const inquiryData = {
      ...data,
      cartItems: cartItems.map(item => ({
        id: String(item.id),
        name: item.name,
        price: item.price || 0,
        quantity: item.quantity || 1,
        image_url: item.image || null,
      })),
    };

    try {
      const result = await createInquiry(inquiryData)
      if (result.isSuccess) {
        toast.success("Inquiry Sent!", {
          description: result.message || "Thank you for your inquiry. We'll get back to you soon.",
        })
        reset()
      } else {
        if (result.fields) {
          Object.entries(result.fields).forEach(([fieldName, fieldError]) => {
            if (Array.isArray(fieldError) && fieldError.length > 0) {
              form.setError(fieldName as keyof InquiryFormValues, { message: fieldError.join(", ") })
            } else if (typeof fieldError === 'string') {
               form.setError(fieldName as keyof InquiryFormValues, { message: fieldError })
            }
          })
        }
        throw new Error(result.error || "An unknown error occurred while sending your inquiry.")
      }
    } catch (error: any) {
      toast.error("Submission Failed", {
        description: error.message || "There was a problem sending your inquiry. Please try again.",
      })
    }
  }

  if (isSubmitSuccessful && !isSubmitting) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-md">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Inquiry Sent!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Thank you for your inquiry. We'll get back to you as soon as possible.</p>
            <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleWhatsAppInquiry}
                disabled={cartItems.length === 0}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Inquire on WhatsApp
              </Button>
              {/* <Button
                variant="outline"
                onClick={() => {
                  form.reset({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    subject: "Inquiry about items in cart",
                    message: "",
                    cartItems: [],
                  });
                }}
                className="w-full sm:w-auto"
              >
                Send Another Inquiry
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-2">Submit Your Inquiry</h1>
          <p className="text-muted-foreground mb-8">
            Please provide your contact details. We will get back to you regarding the items in your cart.
          </p>

          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone (Optional)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={control} name="subject" render={({ field }) => (
                <FormItem><FormLabel>Subject</FormLabel><FormControl><Input {...field} /></FormControl>
                <FormDescription>Defaulted to cart inquiry, you can change if needed.</FormDescription>
                <FormMessage /></FormItem>
              )} />
              <FormField control={control} name="message" render={({ field }) => (
                <FormItem><FormLabel>Additional Message (Optional)</FormLabel><FormControl><Textarea rows={5} placeholder="Include any specific details or questions here..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              {cartItems.length > 0 ? (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <h3 className="text-lg font-semibold">Items for Inquiry:</h3>
                  <ul className="space-y-2 text-sm">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <span>{item.name} (x {item.quantity || 1})</span>
                        <span>Enquire for price</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t pt-3 mt-3">
                    <p className="flex justify-between text-md font-semibold">
                        <span>Subtotal:</span>
                        <span>To be quoted</span>
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    These items will be included with your inquiry.
                  </p>
                </div>
              ) : (
                 <Card className="my-6">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">Your cart is currently empty.</p>
                        <Button asChild variant="link" className="mt-2">
                            <Link href="/store">Browse Products</Link>
                        </Button>
                    </CardContent>
                 </Card>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </Button>
              {cartItems.length === 0 && <p className="text-sm text-center text-red-600">Please add items to your cart before sending an inquiry.</p>}
            </form>
          </Form>
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <Card>
            <CardHeader>
              <CardTitle>Our Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    100 ft Road
                    <br />
                    Udaipur, Rajasthan
                    <br />
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    +91 98290 00000
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    info@mushroomsjunior.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
