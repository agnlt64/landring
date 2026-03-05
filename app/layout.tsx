import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ANTONIN DRING // DRING.EXE",
  description: "Artiste · Rappeur · Dev Underground — Album DRING.EXE disponible maintenant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${jetbrains.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
