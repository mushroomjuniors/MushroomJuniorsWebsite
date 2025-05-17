import { createClient } from "@supabase/supabase-js";
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
  Boxes
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

let supabaseAdminClient: any;
if (supabaseUrl && supabaseServiceKey) {
  supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('Supabase URL or Service Role Key is missing for admin dashboard. Counts will be 0.');
}

export default async function AdminDashboard() {
  let categoryCount = 0;
  let productCount = 0;

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

    } catch (error) {
      console.error("Error fetching dashboard counts:", error);
      // Keep counts at 0 if there's an error
    }
  }

    return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.00</div>
              <p className="text-xs text-muted-foreground">
                Based on current data
              </p>
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
               <Link href="/admin/categories" className="text-xs text-muted-foreground hover:underline">
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
              <Link href="/admin/products" className="text-xs text-muted-foreground hover:underline">
                View all products
              </Link>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* Placeholder for recent orders or activity feed */}
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Recent actions and updates in the admin panel.
                </CardDescription>
              </div>
              {/* <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button> */}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No recent activity to display yet.
              </p>
              {/* Example Table for future use
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <div className="font-medium">Admin User</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        admin@example.com
                      </div>
                    </TableCell>
                    <TableCell>Logged In</TableCell>
                    <TableCell className="text-right">2023-06-23</TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}
            </CardContent>
          </Card>
          {/* You can add more cards or components here */}
        </div>
      </main>
    </div>
  );
}
