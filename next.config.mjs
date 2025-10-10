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
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend request
        destination: "http://demo.orium.api.harichtech.com/api/:path*", // backend URL
      },
    ];
  },
};

export default nextConfig;
