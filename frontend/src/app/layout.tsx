import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./editor.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Word Processor",
  description: "AI Word Processor - Create professional proposals, reports, and letters in seconds. By Musamusakannike (codiac)",
  openGraph: {
    title: "AI Word Processor",
    description: "AI Word Processor - Create professional proposals, reports, and letters in seconds. By Musamusakannike (codiac)",
    images: [
      {
        url: "/metadata.png",
        alt: "AI Word Processor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Word Processor",
    description: "AI Word Processor - Create professional proposals, reports, and letters in seconds. By Musamusakannike (codiac)",
    images: ["/metadata.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
