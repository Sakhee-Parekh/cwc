import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Provider Finder",
  description: "Searchable provider database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`}
      >
        <div className="min-h-screen bg-zinc-50">
          <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-2xl bg-zinc-900" />
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-zinc-900">
                    Provider Finder
                  </div>
                  <div className="text-xs text-zinc-500">Search database</div>
                </div>
              </div>
            </div>
          </header>
          <div className="mx-auto w-full flex-1 overflow-hidden px-4 py-6 sm:px-6">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
