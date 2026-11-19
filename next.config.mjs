const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    // Better Auth runs on the Express server. Proxying it through the Next.js origin keeps the
    // session cookie first-party, which makes auth reliable on Vercel (no third-party cookie issues).
    return [{ source: "/api/auth/:path*", destination: `${apiUrl}/api/auth/:path*` }];
  },
};

export default nextConfig;
