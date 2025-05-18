import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";

// Supabase admin client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabaseAdminClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn(
    "Supabase URL or Service Role Key is missing for admin inquiries page. No data will be fetched."
  );
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
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

async function getInquiries(): Promise<Inquiry[]> {
  if (!supabaseAdminClient) {
    return [];
  }
  try {
    const { data, error } = await supabaseAdminClient
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching inquiries:", error);
    return [];
  }
}

// Helper function to format dates (optional)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="icon" asChild className="h-7 w-7">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">All Inquiries</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inquiries</CardTitle>
            <CardDescription>
              Manage and view all customer inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inquiries.length > 0 ? (
              <Table>
                <TableCaption>A list of all submitted inquiries.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cart Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>{formatDate(inquiry.created_at)}</TableCell>
                      <TableCell className="font-medium">
                        {inquiry.first_name} {inquiry.last_name}
                      </TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.subject}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inquiry.status === "new"
                              ? "default"
                              : inquiry.status === "read"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {inquiry.cart_items &&
                        inquiry.cart_items.length > 0 ? (
                          <div className="text-xs">
                            {inquiry.cart_items.length} item(s)
                            <ul className="pl-2 list-disc list-inside">
                              {inquiry.cart_items.slice(0, 2).map(item => ( // Show first 2 items
                                <li key={item.id} title={`${item.name} (Qty: ${item.quantity})`}>
                                  {item.name.length > 15 ? `${item.name.substring(0,12)}...` : item.name}
                                </li>
                              ))}
                              {inquiry.cart_items.length > 2 && <li>...and more</li>}
                            </ul>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {/* Placeholder for actions like view details, mark as read, etc. */}
                        <Button variant="outline" size="sm" asChild>
                           {/* We will create this page next or link to a modal */}
                          <Link href={`/admin/inquiries/${inquiry.id}`}>
                            <Eye className="mr-2 h-3 w-3" /> View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No inquiries found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// TODO:
// 1. Create a detail page /admin/inquiries/[id]/page.tsx (or a modal) to show full inquiry details including full message and all cart items.
// 2. Implement actions: mark as read/unread, update status, delete.
// 3. Add pagination if the number of inquiries grows large.
// 4. Add filtering and sorting options. 