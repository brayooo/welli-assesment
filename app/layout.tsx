import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Growth Engineer - Registration",
  description: "Professional registration form with A/B testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
