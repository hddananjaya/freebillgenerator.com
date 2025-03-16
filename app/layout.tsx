import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreeBillGenerator.com – Your Free Minimal Invoice Maker",
  description:
    "Create simple, professional invoices instantly. Totally free with no hidden fees or watermarks.",
  openGraph: {
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Free Bill Generator",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
