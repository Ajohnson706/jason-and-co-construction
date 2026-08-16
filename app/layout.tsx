import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jason & Co. Construction | Finish Carpentry & New Construction",
  description: "Finish carpentry for new construction and residential projects in Augusta and the CSRA, including interior trim, crown molding, casing, built-ins, cabinetry, stair trim, and custom woodwork.",
  alternates: { canonical: "https://jasonandcoconstruction.com/" },
  openGraph: {
    title: "Jason & Co. Construction | Finish Carpentry",
    description: "Precision trim, built-ins, cabinetry, and custom woodwork for new construction and residential projects in Augusta and the CSRA.",
    url: "https://jasonandcoconstruction.com/",
    siteName: "Jason & Co. Construction",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
