import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000")
  ),
  title: "Chic A Boo",
  description: "Bespoke flowers and gifts crafted with care.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Chic A Boo",
    description: "Bespoke flowers and gifts crafted with care.",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1536,
        height: 1024,
        alt: "Chic A Boo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chic A Boo",
    description: "Bespoke flowers and gifts crafted with care.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
