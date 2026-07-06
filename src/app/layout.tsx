import type { Metadata } from "next";
import { Lora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AppShell } from "@/components/AppShell";

const display = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Library Manager",
  description: "Frontend quan ly thu vien dung Next.js, Apollo Client va GraphQL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={display.variable + " " + body.variable + " " + mono.variable + " font-body"}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}