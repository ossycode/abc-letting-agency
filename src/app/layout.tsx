import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import AuthRedirector from "./AuthRedirector";

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
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <Providers>
          <AuthRedirector />
          {children}
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
