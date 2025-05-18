import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MessageSquare, ShoppingCart, CalendarDays, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { InquiryStatusUpdater } from "@/components/admin/InquiryStatusUpdater";

// Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabaseAdminClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn(
    "Supabase URL or Service Role Key is missing for admin inquiry detail page. No data will be fetched."
  );
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

interface Inquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: string;
  cart_items?: CartItem[] | null;
}

async function getInquiryById(id: string): Promise<Inquiry | null> {
  if (!supabaseAdminClient) {
    return null;
  }
  try {
    const { data, error } = await supabaseAdminClient
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single(); // Use .single() to get one record or null

    if (error && error.code !== "PGRST116") { // PGRST116: Row to retrieve was not found
      console.error(`Error fetching inquiry with id ${id}:`, error);
      return null;
    }
    if (error && error.code === "PGRST116") {
      return null; // Explicitly return null if not found, caught by notFound() later
    }
    return data as Inquiry | null;
  } catch (error) {
    console.error(`Unexpected error fetching inquiry with id ${id}:`, error);
    return null;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await getInquiryById(params.id);

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/inquiries">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Inquiries
          </Link>
        </Button>
        {/* Status Updater will go here or nearby */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Inquiry Details</CardTitle>
              <CardDescription>
                Viewing inquiry ID: {inquiry.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {inquiry.first_name} {inquiry.last_name}</p>
                    <p><Mail className="inline mr-2 h-4 w-4 text-muted-foreground" /> <strong>Email:</strong> <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">{inquiry.email}</a></p>
                    {inquiry.phone && (
                      <p><Phone className="inline mr-2 h-4 w-4 text-muted-foreground" /> <strong>Phone:</strong> {inquiry.phone}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Inquiry Meta</h3>
                  <div className="space-y-2 text-sm">
                    <p><CalendarDays className="inline mr-2 h-4 w-4 text-muted-foreground" /> <strong>Received:</strong> {formatDate(inquiry.created_at)}</p>
                    <p><Tag className="inline mr-2 h-4 w-4 text-muted-foreground" /> <strong>Current Status:</strong>
                      <Badge 
                        variant={inquiry.status === "new" ? "default" : inquiry.status === "read" ? "secondary" : "outline"}
                        className="ml-2"
                      >
                        {inquiry.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
    
              <div>
                <h3 className="text-lg font-semibold mb-2"><MessageSquare className="inline mr-2 h-5 w-5" />Subject</h3>
                <p className="text-lg">{inquiry.subject}</p>
              </div>
    
              <div>
                <h3 className="text-lg font-semibold mb-2">Message</h3>
                <div className="p-4 border bg-muted/40 rounded-md whitespace-pre-wrap text-sm">
                  {inquiry.message}
                </div>
              </div>
            </CardContent>
          </Card>
    
          {inquiry.cart_items && inquiry.cart_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle><ShoppingCart className="inline mr-2 h-5 w-5" />Inquired Cart Items ({inquiry.cart_items.length})</CardTitle>
                <CardDescription>Products the user was inquiring about.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead className="text-center">Quantity</TableHead>
                      <TableHead className="text-right">Price per item</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiry.cart_items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.image_url ? (
                            <div className="relative w-16 h-16 rounded-md overflow-hidden">
                               <Image 
                                src={item.image_url} 
                                alt={item.name} 
                                fill
                                sizes="(max-width: 768px) 10vw, (max-width: 1200px) 5vw, 64px" 
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                   <TableCaption>Total Value of Inquired Items: ${inquiry.cart_items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</TableCaption>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <InquiryStatusUpdater inquiryId={inquiry.id} currentStatus={inquiry.status} />
            {/* You could add other action cards here, e.g., Internal Notes */}
          </div>
        </div>
      </div>
    </div>
  );
} 