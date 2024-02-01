"use client";
import "./globals.css";
import Navigation from "../components/Navigation";
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <Navigation />
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
