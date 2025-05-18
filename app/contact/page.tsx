"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Mail, Phone, Clock } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative">
        <div
          className="relative h-[50vh] flex items-center justify-center bg-cover bg-center bg-slate-800"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/contact-bg.avif')`,
          }}
        >
          <div className="container px-4 mx-auto text-center z-10">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Contact Us</h1>
            <p className="mt-4 text-xl text-white max-w-3xl mx-auto">
              We'd love to hear from you. Reach out with any questions, feedback, or inquiries.
            </p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-16 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-green-600"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-4">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={5} required />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Address</h4>
                    <p className="text-muted-foreground">
                    100 Feet Rd  
                      <br />
                      Shobhagpura, Udaipur, Rajasthan
                      <br />
                      India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p className="text-muted-foreground">+91 9829000000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p className="text-muted-foreground">info@mushroomjunior.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Business Hours</h4>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Store Locations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Udaipur</h4>
                  <p className="text-muted-foreground">
                    100 Feet Rd
                    <br />
                    Shobhagpura, Udaipur, Rajasthan
                  </p>
                </div>
                {/* <div>
                  <h4 className="font-medium">Los Angeles</h4>
                  <p className="text-muted-foreground">
                    456 Style Avenue
                    <br />
                    Los Angeles, CA 90001
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Chicago</h4>
                  <p className="text-muted-foreground">
                    789 Trend Boulevard
                    <br />
                    Chicago, IL 60001
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold mb-4">Find Us</h3>
          <div className="h-[400px] md:h-[450px] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3627.5325104165904!2d73.7067500109828!3d24.6053249553278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5a5bce203eb%3A0xdbee26a8c1e005fc!2sMushroom%20Juniors!5e0!3m2!1sen!2sin!4v1747568285071!5m2!1sen!2sin" 
              width="100%"
              height="100%"
              style={{ border:0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
