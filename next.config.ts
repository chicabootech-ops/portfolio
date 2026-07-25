import type { NextConfig } from "next";

// When building the container image we emit a self-contained Next server
// (`output: "standalone"`) instead of the Cloudflare Worker bundle.
const isDocker = process.env.DOCKER_BUILD === "1";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

const connectSrc = [
  "'self'",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
  "https://backend-code-38xz.onrender.com",
  apiUrl,
]
  .filter(Boolean)
  .join(" ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src ${connectSrc}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
  },
];

const nextConfig: NextConfig = {
  ...(isDocker ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000" },
      { protocol: "https", hostname: "backend-code-38xz.onrender.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
  // Keep the Worker under Cloudflare Free's 3 MiB gzip limit.
  // React Compiler / Babel inflate the OpenNext server bundle.
  experimental: {
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

// Cloudflare dev bindings — not needed (and skipped) for container builds.
if (!isDocker) {
  const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
}
