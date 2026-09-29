import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema NGR Auxiliar",
  description: "Sistema para captura, QR y mapeo de taller",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <Navbar />
        <main className="pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}