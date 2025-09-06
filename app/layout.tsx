import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LumiRider Pro",
  description: "Rider Técnico para Iluminação",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
