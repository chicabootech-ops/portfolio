import type { Metadata } from "next";
import { ConditionalNavbar, Footer } from "@/components/layout";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: siteConfig.logo,
    shortcut: siteConfig.logo,
    apple: siteConfig.logo,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
    images: [
      {
        url: siteConfig.logo,
        width: 1536,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background font-sans">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <ConditionalNavbar />
              {children}
              <Footer />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
