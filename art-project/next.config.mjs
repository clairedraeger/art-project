/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['res.cloudinary.com'], // Allow Cloudinary-hosted images
    },
  };
  
  export default nextConfig;
  