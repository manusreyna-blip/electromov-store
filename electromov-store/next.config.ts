import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      { source: "/api/catalog", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
      { source: "/llms.txt", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
    ];
  },
  async redirects() {
    return [
      // URLs del sitio anterior en GitHub Pages: se redirigen con 301 para no
      // perder el posicionamiento ni romper los links que ya están publicados.
      {
        source: "/b2b-carga-electrica-edificios-hoteles-argentina.html",
        destination: "/b2b",
        permanent: true,
      },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/producto", destination: "/productos", permanent: true },
      { source: "/productos.html", destination: "/productos", permanent: true },
      { source: "/asesor.html", destination: "/asesor", permanent: true },
      { source: "/ahorro.html", destination: "/calculadora", permanent: true },
      { source: "/faq.html", destination: "/ayuda/faq", permanent: true },
      { source: "/envios.html", destination: "/ayuda/envios", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
