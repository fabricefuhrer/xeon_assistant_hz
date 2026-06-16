import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intel Xeon 6 Deal Assistant",
  description: "Xeon recommendation dashboard for deal sizing and CPU selection."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
