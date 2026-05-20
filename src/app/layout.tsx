import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "cartContainer — Demo Ecommerce Store",
  description: "Open-source ecommerce boilerplate built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh flex flex-col bg-zinc-50 text-zinc-900 antialiased font-sans">
        <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <a href="/" className="text-lg font-bold tracking-tight">
              cart<span className="text-blue-600">Container</span>
            </a>
            <div className="flex items-center gap-6 text-sm font-medium">
              <a href="/products" className="hover:text-blue-600 transition-colors">Products</a>
              <a href="/cart" className="hover:text-blue-600 transition-colors">Cart</a>
              <a href="/orders" className="hover:text-blue-600 transition-colors">Orders</a>
              <a href="/auth/signin" className="rounded-full bg-zinc-900 px-4 py-1.5 text-white hover:bg-zinc-700 transition-colors text-xs">Sign In</a>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t bg-white py-8 text-center text-xs text-zinc-400">
          cartContainer — Open-source ecommerce demo
        </footer>
      </body>
    </html>
  );
}
