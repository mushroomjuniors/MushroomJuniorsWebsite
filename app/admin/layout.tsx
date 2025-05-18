"use client"; // This layout will use hooks, so it can be a client component or parts of it.

import { PropsWithChildren, useEffect } from 'react';
import { useUser, UserButton, SignedIn, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, Package2, ShieldAlert } from 'lucide-react'; // Added ShieldAlert for mobile message
import { Footer } from '@/components/footer';

function AdminHeader() {
  return (
    // Hide header on mobile, show on md and up
    <header className="sticky top-0 z-40 hidden w-full border-b bg-background md:block">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/admin" className="flex items-center space-x-2">
          <Home className="h-6 w-6" /> 
          <span className="font-bold sm:inline-block">Admin Panel</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: PropsWithChildren) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { orgRole } = useAuth(); // orgSlug removed as it wasn't used in example logic
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in?redirect_url=' + window.location.pathname);
      return;
    }
    if (isLoaded && isSignedIn) {
      const isAdmin = user?.publicMetadata?.role === 'admin';
      if (!isAdmin) {
        router.push('/'); 
      }
    }
  }, [isLoaded, isSignedIn, user, orgRole, router]); // orgSlug removed from dependencies

  // Loading state or if user is not admin (will be redirected soon)
  if (!isLoaded || !isSignedIn || !(user?.publicMetadata?.role === 'admin')) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Still show a minimal header or nothing on mobile during loading/redirect */}
        <div className="sticky top-0 z-40 w-full border-b bg-background md:hidden">
          <div className="container flex h-16 items-center justify-center">
             <span className="font-bold">Admin Area</span>
          </div>
        </div>
        <AdminHeader /> {/* This is hidden on mobile by its own classes */}
        <main className="flex flex-1 items-center justify-center">
          <p>Loading access control...</p> 
        </main>
        <Footer />
      </div>
    );
  }

  // User is loaded, signed in, and is an admin - content display logic
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      {/* Mobile-only Message - shown if screen is small */}
      <div className="block md:hidden h-screen flex-grow flex flex-col items-center justify-center p-6 text-center bg-background">
        <ShieldAlert className="h-12 w-12 mb-6 text-destructive" /> 
        <h1 className="text-2xl font-semibold mb-3">Admin Panel Not Available</h1>
        <p className="text-lg text-muted-foreground">
          This admin panel is designed for desktop use only.
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Please access it from a device with a larger screen.
        </p>
      </div>

      {/* Desktop Content - hidden on small screens, shown on md and up */}
      <main className="hidden md:block flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
