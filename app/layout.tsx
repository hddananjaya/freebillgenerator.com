import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Free Bill Generator - Create Unlimited PDF Invoices Online",
  description:
    "Generate professional invoices instantly with FreeBillGenerator.com. A 100% free online invoice maker. No sign-ups, no hidden fees—just quick, unlimited PDF invoices for freelancers, businesses, and individuals.",
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
