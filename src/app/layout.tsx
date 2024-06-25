import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | dominé",
    default: "dominé", // a default is required when creating a template
  },
  description: "An Hr Automate system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="winter">
      <body className="font-uber_move overflow-hidden">{children}</body>
    </html>
  );
}
