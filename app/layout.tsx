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
  title: "Paper Games",
  description:
    "Classic pen-and-paper games digitized with a vintage notebook feel.",
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
