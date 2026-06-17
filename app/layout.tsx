import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xeon Deal Assistant",
  description: "Lenovo and Intel Xeon CPU selector dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
