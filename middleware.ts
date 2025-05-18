import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define routes that should be publicly accessible
const isPublicRoute = createRouteMatcher([
  '/',
  '/store(.*)',
  '/products(.*)',
  '/contact',
  '/about',
  '/inquire',
  '/sign-in(.*)', // Clerk handles these pages
  '/sign-up(.*)', // Clerk handles these pages
  '/api/webhooks/(.*)', // Example for public webhooks
]);

// This is the simplified middleware. 
// If a request is not for a public route, clerkMiddleware should automatically handle protection.
export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    // For non-public routes, Clerk needs to know to protect them.
    // The auth() object itself should be used for this, but not via a .protect() method if it's a promise.
    // The standard is to call auth() and let Clerk handle it.
    // If auth().userId is null for a non-public route, Clerk redirects.
    // If we need to check roles here, we'd need to resolve the auth() promise first.
    // For now, we are deferring role checks to page/layout components.
    auth(); // Calling auth() makes Clerk aware and trigger protection if not authenticated.
  }
  // For public routes, we do nothing, allowing access.
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}; 