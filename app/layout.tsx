import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Daniel Richardson | Data Scientist",
  description:
    "Portfolio for Daniel Richardson, a data scientist specializing in analytics, experimentation, and generative AI–enabled workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-zinc-200/60 bg-white/80 backdrop-blur dark:bg-black/80 dark:border-zinc-800">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                Daniel Richardson
              </Link>
              <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
                <Link href="/about" className="hover:text-zinc-900 dark:hover:text-white">
                  About
                </Link>
                <Link href="/experience" className="hover:text-zinc-900 dark:hover:text-white">
                  Experience
                </Link>
                <Link href="/projects" className="hover:text-zinc-900 dark:hover:text-white">
                  Projects
                </Link>
                <Link href="/gen-ai" className="hover:text-zinc-900 dark:hover:text-white">
                  Gen AI
                </Link>
              </div>
            </nav>
          </header>
          <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-8 md:px-6 md:py-10">
            {children}
          </main>
          <footer className="border-t border-zinc-200/60 bg-white/80 py-4 text-xs text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-black/80">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 md:px-6">
              <span>© {new Date().getFullYear()} Daniel Richardson</span>
              <a
                href="https://www.linkedin.com/in/daniel-r-richardson/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                LinkedIn
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

