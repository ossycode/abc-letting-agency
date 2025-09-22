import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import "@/api/config";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import ClientConfig from "./ClientConfig";

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
      <body className={`${outfit.className}antialiased`}>
        <ClientConfig />
        <Providers>{children}</Providers>
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
