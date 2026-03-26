import type { Metadata } from "next";
import { Public_Sans, Tenor_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Community Wellness Collective",
  description: "Community Wellness Collective",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${tenorSans.variable} antialiased`}>
        <div className="min-h-dvh w-full">{children}</div>
      </body>
    </html>
  );
}
