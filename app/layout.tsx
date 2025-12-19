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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Merriweather:wght@300;400;700&family=Raleway:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&family=PT+Serif:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&family=Ubuntu:wght@300;400;500;700&family=Nunito:wght@300;400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&family=Bebas+Neue&family=Archivo:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600;700&family=Quicksand:wght@300;400;500;600;700&family=Work+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
