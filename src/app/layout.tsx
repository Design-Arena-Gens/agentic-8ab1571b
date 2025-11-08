import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plumbing Workforce Agent",
  description: "AI-assisted agent workspace for contractor and labour coordination"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100">{children}</body>
    </html>
  );
}
