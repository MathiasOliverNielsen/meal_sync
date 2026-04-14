import type { Metadata } from "next";
import Navbar from "../components/Navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: "Meal Sync",
  description: "Plan your meals and generate shopping lists",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ff1f1f" />
        <link rel="icon" href="/icons/MealSync192x192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar isLoggedIn={false} />
        {children}
      </body>
    </html>
  );
}
