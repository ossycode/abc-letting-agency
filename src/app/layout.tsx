import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import AuthRedirector from "./AuthRedirector";
import { Suspense } from "react";
import { LoaderOverlay } from "@/components/Loader";

const outfit = Outfit({
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    template: "%s - ABC Letting Agency",
    default: "ABC Letting Agency",
  },
  description: "ABC Letting Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased`}>
        <Providers>
          <Suspense fallback={<LoaderOverlay />}>
            <AuthRedirector />
            {children}
          </Suspense>
        </Providers>
        <Toaster
          toastOptions={{
            duration: 6000,
            position: "top-right",
          }}
        />
      </body>
    </html>
  );
}
