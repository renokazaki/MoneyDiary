import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./Header";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Money Diary",
  description: "金銭管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ja">
        <body>
          <header>
            <Header />
          </header>
          <Separator />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
