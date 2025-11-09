import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Actually used hosts based on product, gallery, and review images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.darbukaplanet.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'krishnaflutestore.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'musicmaster.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aurosus.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.etsystatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'n1.sdlcdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'r2.gear4music.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'target.scene7.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'manuals.plus',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'audiostatus.lt',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.wixstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'musicsquare.eu',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.guitarcenter.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mos.cms.futurecdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '4.imimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'terrycartermusicstore.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.coastmusiconline.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.zikinf.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.rainpos.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'w7.pngwing.com',
        port: '',
        pathname: '/**',
      },
      // Newly discovered host from error
      {
        protocol: 'https',
        hostname: 'images-eu.ssl-images-amazon.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'teds-list.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'carusopianos.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'purepng.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'media.musiciansfriend.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'media.wwbw.com',
        port: '',
        pathname: '/**',
      },
      // Added for gallery images
      {
        protocol: 'https',
        hostname: 'www.irishflutestore.com',
        port: '',
        pathname: '/**',
      },
      // Wildcard patterns for flexibility (covers multiple domains)
      {
        protocol: 'https',
        hostname: '*.blogspot.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.susercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.walmartimages.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.gear4music.com',
        port: '',
        pathname: '/**',
      },
      // Gallery-specific domains
      {
        protocol: 'https',
        hostname: 'www.chrisjmendez.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.pngall.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'png.pngtree.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wallpapercave.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'carusopianos.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'teds-list.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'purepng.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;