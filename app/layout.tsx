import type { Metadata } from "next";
import Link from "next/link";
import { Space_Grotesk, JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { LenisProvider } from "@/app/components/lenis-provider";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Daniel Richardson | AI Systems & Data Science",
  description:
    "Daniel Richardson is a Senior Data Scientist and AI systems builder at Pinterest who turns ambiguous problems into production products with measurable impact.",
};

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#impact", label: "Impact" },
  { href: "/#work", label: "Work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#education", label: "Education" },
  { href: "/#connect", label: "Connect" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}>
        <LenisProvider>
          {/* Fixed top nav */}
          <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-white/5 bg-background/70">
            <Link href="/#home" className="font-display text-lg font-medium tracking-tight">
              daniel.
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="label-mono text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex md:hidden items-center gap-4">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="label-mono text-muted hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Main content */}
          <main className="pt-16">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
