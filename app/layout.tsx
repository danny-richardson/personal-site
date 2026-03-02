import type { Metadata } from "next";
import Link from "next/link";
import { DM_Serif_Display, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Daniel Richardson | AI Systems & Data Science",
  description:
    "Daniel Richardson is a Senior Data Scientist and AI systems builder at Pinterest who turns ambiguous problems into production products with measurable impact.",
};

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#work", label: "Work" },
  { href: "/#stack", label: "Stack" },
  { href: "/#impact", label: "Impact" },
  { href: "/#about", label: "About" },
  { href: "/#education", label: "Education" },
  { href: "/#experience", label: "Experience" },
  { href: "/#connect", label: "Connect" },
] as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <div className="min-h-screen bg-page text-page md:flex">
          {/* Sidebar for desktop */}
          <aside className="hidden w-64 flex-col justify-between border-r border-neutral-200 bg-sidebar px-8 py-8 md:flex">
            <div className="space-y-8">
              <div className="space-y-1">
                <Link
                  href="/#home"
                  className="font-display text-xl font-semibold tracking-tight"
                >
                  daniel.
                </Link>
                <p className="text-xs text-neutral-600">
                  Data scientist & AI systems builder
                </p>
              </div>
              <nav className="space-y-2 text-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-full px-3 py-1 text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="space-y-2 text-xs text-neutral-500">
              <p>San Francisco, California</p>
              <a
                href="https://www.linkedin.com/in/daniel-r-richardson/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-neutral-700 underline-offset-2 hover:underline"
              >
                LinkedIn
              </a>
              <p>© {new Date().getFullYear()} Daniel Richardson</p>
            </div>
          </aside>

          {/* Top nav for mobile */}
          <header className="border-b border-neutral-200 bg-sidebar/95 px-4 py-4 md:hidden">
            <div className="mx-auto flex max-w-5xl items-center justify-between">
              <Link
                href="/#home"
                className="font-display text-lg font-semibold tracking-tight"
              >
                daniel.
              </Link>
              <nav className="flex items-center gap-3 text-xs">
                {navLinks.slice(0, 3).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-neutral-700 underline-offset-2 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto flex-1 px-4 py-10 md:ml-64 md:max-w-4xl md:px-12 md:py-14">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

