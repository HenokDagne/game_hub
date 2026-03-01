import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import AppShell from "@/components/AppShell";
import Providers from "@/app/providers";
import { getSafeServerSession } from "@/lib/session";
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
  title: "GameHub",
  description: "Discover, search, and save your favorite games",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSafeServerSession();
  const role = session?.user?.role === "ADMIN" ? "ADMIN" : session?.user ? "USER" : null;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <AppShell role={role}>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
