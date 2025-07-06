import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'static-assets-web.flixcart.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'image01-in.oneplus.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'my-ecommerce-uploads.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },
  // Add URL rewrites for SEO-friendly product URLs
  async rewrites() {
    return [
      // Meesho-style URLs: /product-slug/p/product-id -> /product/[slug]
      {
        source: '/:productSlug/p/:productId',
        destination: '/product/:productId',
      },
      // Category-product URLs: /category/product-slug-product-id -> /product/[slug]
      {
        source: '/:category/:productSlug-:productId',
        destination: '/product/:productId',
      },
    ];
  },
};

export default nextConfig;
