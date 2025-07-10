import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModalProvider } from '@/context/AuthModalContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { AnalyticsProvider } from '@/context/AnalyticsContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  display: "swap",
  variable: "--font-inter"
});

const poppins = Poppins({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "AllMart",
  description: "AllMart is a  multi-tenant e-commerce SaaS platform for businesses of all sizes",
};

// Split the layout into server and client components
function RootLayoutClient({ children }: { children: React.ReactNode }) {
  'use client';
  
  return (
    <AuthProvider>
      <AnalyticsProvider>
        <AuthModalProvider>
          <CartProvider>
            <CategoryProvider>
              <Header />
              <main className="flex-1 lg:px-4">
                <Suspense fallback={<div>Loading...</div>}>
                  {children}
                </Suspense>
              </main>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: 'white',
                    },
                    style: {
                      border: '1px solid #10B981',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: 'white',
                    },
                    style: {
                      border: '1px solid #EF4444',
                    },
                  },
                }}
              />
            </CategoryProvider>
          </CartProvider>
        </AuthModalProvider>
      </AnalyticsProvider>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} min-h-screen bg-background text-foreground flex flex-col font-sans`}>
        <ThemeProvider>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </ThemeProvider>
      </body>
    </html>
  );
}
