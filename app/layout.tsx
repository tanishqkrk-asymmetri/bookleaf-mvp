import type { Metadata } from "next";
import { Geist, Geist_Mono, Mulish } from "next/font/google";
import "./globals.css";
import { DesignProvider } from "@/context/DesignContext";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Mulish({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookleaf",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Suspense fallback={<></>}>
        <body className={`${geistSans.className}  antialiased`}>
          <AuthProvider>
            <DesignProvider>{children}</DesignProvider>
          </AuthProvider>
        </body>
      </Suspense>
    </html>
  );
}
