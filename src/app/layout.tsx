import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
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
      <Toaster richColors />
      <body className="font-uber_move overflow-hidden">{children}</body>
    </html>
  );
}
