import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "oloids",
  description: "oloids creative studio portfolio.",
  icons: {
    icon: [{ url: "/logo.png?v=2", type: "image/png" }],
    shortcut: ["/logo.png?v=2"],
    apple: ["/logo.png?v=2"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
