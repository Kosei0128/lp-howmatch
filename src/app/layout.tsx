import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web制作 見積シミュレーター",
  description: "Web制作の見積もりをリアルタイムでシミュレーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
