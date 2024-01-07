import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "../../components/Navigation";

import GitHubForkRibbon from "react-github-fork-ribbon";
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
        {children}
      </body>
    </html>
  );
}
