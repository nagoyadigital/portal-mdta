import type { Metadata } from "next";
import { Lexend, Inter } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal MDTA Hidayatul Mubtadi'in",
  description:
    "Platform digital terintegrasi untuk akademik, administrasi, keuangan, dan komunikasi MDTA Hidayatul Mubtadi'in",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lexend.variable} ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
