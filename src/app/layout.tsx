import "./globals.css";
import type { Metadata } from "next";
import Navigation from "../components/Navigation";
export const metadata: Metadata = {
  title: "fugue-state-io",
  description: "Music Learning Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
