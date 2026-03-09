import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohamad Bukhari | Portfolio",
  description: "Final-year Computer Science student at UiTM specializing in Machine Learning, AI, and Full-Stack Development. Gold Medal winner & Dean's List awardee.",
  keywords: ["Mohamad Bukhari", "Portfolio", "AI Developer", "Machine Learning", "Next.js", "UiTM", "Computer Science", "Full-Stack"],
  authors: [{ name: "Mohamad Bukhari" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Mohamad Bukhari | Portfolio",
    description: "Computer Science Student & AI Developer — Building AI-Powered Solutions",
    siteName: "Mohamad Bukhari | Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamad Bukhari | Portfolio",
    description: "Computer Science Student & AI Developer — Building AI-Powered Solutions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
