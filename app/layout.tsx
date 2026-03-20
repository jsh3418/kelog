import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "kelog",
  description: "Frontend Developer Blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-3xl mx-auto px-8 py-4">
            <Link
              href="/"
              className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50"
            >
              kelog
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
