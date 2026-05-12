import { getSiteUrl } from "@/lib/site-url";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Nav } from "./components/nav";
import { TextSizeControl } from "./components/text-size-control";
import { ThemeColorSync } from "./components/theme-color-sync";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeToggle } from "./components/theme-toggle";
import "./globals.css";
import "./rehype-pretty-code.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "kelog",
  description: "Frontend Developer Blog",
  openGraph: {
    title: "kelog",
    description: "Frontend Developer Blog",
    url: "/",
    siteName: "kelog",
    locale: "ko_KR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ThemeColorSync />
          <header className="w-full border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-3 sm:gap-6">
              <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
                <Link
                  href="/"
                  className="text-3xl sm:text-4xl font-semibold tracking-tight text-black dark:text-zinc-50"
                >
                  kelog
                </Link>
                <Nav />
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <TextSizeControl />
                <ThemeToggle />
              </div>
            </div>
          </header>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
