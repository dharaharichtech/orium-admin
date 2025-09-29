/** @type {import('next').NextConfig} */
const nextConfig = {
   output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname:"/uploads/**"
      },
    ],
  },
};

export default nextConfig;
