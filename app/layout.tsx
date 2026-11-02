import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FavBook | Modern Online Library",
  description: "A modern online library to discover, add, borrow, and return books seamlessly with real-time copy tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" data-theme="dark">
      <body className={`${inter.className} min-h-screen flex flex-col bg-[#090d16] text-slate-100 antialiased`}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <Toaster position="bottom-right" reverseOrder={false} />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
