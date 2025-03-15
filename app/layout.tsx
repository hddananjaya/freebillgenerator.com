import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Bill Generator - Create Unlimited PDF Invoices Online",
  description:
    "Need an invoice? Make one in seconds with FreeBillGenerator.com. Totally free, no sign-ups, no limits. Just quick, easy PDF invoices, hassle-free.",
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
