import type React from "react";
import "./globals.css";
import AppProviders from "../components/AppProviders";
import BreadcrumbsNav from "../components/BreadcrumbsNav";

export const metadata = {
  title: "KlikMart",
  description: "KlikMart - Your modern online marketplace",
  icons: {
    icon: "/LOGO KLIKMART.png",
    shortcut: "/LOGO KLIKMART.png",
    apple: "/LOGO KLIKMART.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300">
        <AppProviders>
          <BreadcrumbsNav />
          <main className=" max-w-7xl mx-auto">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
