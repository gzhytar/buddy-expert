import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "buddY expert", template: "%s · buddY expert" },
  description:
    "Reflexní a učební vrstva pro experty JIC — příprava, reflexe a sdílený konzultační jazyk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${fraunces.variable} ${sourceSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
