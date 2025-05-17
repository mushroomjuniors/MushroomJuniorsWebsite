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
};

export default nextConfig;
