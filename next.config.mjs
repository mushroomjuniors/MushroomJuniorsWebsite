/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // You can add other domains here if needed in the future
      // For example, if your Supabase storage has a specific hostname:
      // {
      //   protocol: 'https',
      //   hostname: 'your-supabase-storage-hostname.supabase.co', 
      //   port: '',
      //   pathname: '/**',
      // },
    ],
  },
  // Ignore TypeScript errors during build
  typescript: {
    // !! WARN !!
    // Ignoring type checking can increase the risk of runtime errors
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    // !! WARN !!
    // Ignoring ESLint errors can increase the risk of code quality issues
    ignoreDuringBuilds: true,
  },
  serverActions: {
    bodySizeLimit: '15mb', // or whatever limit you need
  },
};

export default nextConfig;
