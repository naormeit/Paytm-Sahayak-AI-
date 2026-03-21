import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sahayak AI | Paytm Build for India",
  description: "Agentic Khata Management for Bharat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[#f8f9fa] text-gray-900 antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
