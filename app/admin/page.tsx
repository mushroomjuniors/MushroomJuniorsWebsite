import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Tags,
  Boxes,
  MessageSquareText,
  UsersIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Supabase admin client (uses service_role key for server-side fetching)
// Ensure these environment variables are set in your .env.local or Vercel environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let supabaseAdminClient: SupabaseClient | null = null;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('Supabase URL or Service Role Key is missing for admin dashboard. Counts will be 0.');
}

interface Inquiry {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
}

export default async function AdminDashboard() {
  let categoryCount = 0;
  let productCount = 0;
  let inquiryCount = 0;
  let recentInquiries: Inquiry[] = [];

  if (supabaseAdminClient) {
    try {
      const { count: catCount, error: catError } = await supabaseAdminClient
        .from('categories')
        .select('*', { count: 'exact', head: true });

      if (catError) throw catError;
      categoryCount = catCount || 0;

      const { count: prodCount, error: prodError } = await supabaseAdminClient
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (prodError) throw prodError;
      productCount = prodCount || 0;

      const { count: inqCount, error: inqError } = await supabaseAdminClient
        .from('inquiries')
        .select('*', { count: 'exact', head: true });

      if (inqError) throw inqError;
      inquiryCount = inqCount || 0;

      const { data: inqData, error: recentInqError } = await supabaseAdminClient
        .from('inquiries')
        .select('id, created_at, first_name, last_name, email, subject')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentInqError) throw recentInqError;
      recentInquiries = inqData || [];

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep counts and arrays empty/default if there's an error
    }
  }

  return (
    <main className="grid flex-1 items-start gap-4 md:gap-8">
      
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inquiries
            </CardTitle>
            <MessageSquareText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inquiryCount}</div>
            <Link href="/admin/inquiries" className="text-base font-semibold text-black hover:underline hover:text-black/80 transition-colors duration-150"
            >
              View all inquiries
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <Tags className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <Link
              href="/admin/categories"
              className="text-base font-semibold text-black hover:underline hover:text-black/80 transition-colors duration-150"
            >
              View all categories
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount}</div>
            <Link
              href="/admin/products"
              className="text-base font-semibold text-black hover:underline hover:text-black/80 transition-colors duration-150"
            >
              View all products
            </Link>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Inquiries</CardTitle>
              <CardDescription>
                Latest messages received from the contact form.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/inquiries">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentInquiries.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <div className="font-medium">{`${inquiry.first_name} ${inquiry.last_name}`}</div>
                      </TableCell>
                      <TableCell>{inquiry.email}</TableCell>
                      <TableCell>{inquiry.subject}</TableCell>
                      <TableCell className="text-right">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent inquiries to display yet.
              </p>
            )}
          </CardContent>
        </Card>
        <div className="flex items-start justify-end">
          <a
            href="https://analytics.google.com/analytics/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-black text-white font-semibold rounded hover:bg-red-700 transition-colors duration-150"
          >
            Go to Google Analytics
          </a>
        </div>
      </div>
    </main>
  );
}
