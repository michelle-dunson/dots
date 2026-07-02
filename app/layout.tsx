import type { Metadata } from "next";
import { Caveat, Libre_Baskerville } from "next/font/google";
import "@/styles/globals.scss";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Dots & Boxes",
  description:
    "A vintage pen-and-paper Dots and Boxes game for 1–4 local players.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${libreBaskerville.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
