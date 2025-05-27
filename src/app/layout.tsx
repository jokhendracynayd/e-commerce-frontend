import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "E-Commerce SaaS Platform",
  description: "A multi-tenant e-commerce SaaS platform for businesses of all sizes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground flex flex-col">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1 px-4">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
