import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AppProviders } from "@/components/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  display: "swap",
});

const nunito = localFont({
  variable: "--font-nunito",
  display: "swap",
  src: [
    {
      path: "../public/fonts/nunito-latin-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nunito-latin-Regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nunito-latin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/nunito-latin-Bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

const openSans = localFont({
  variable: "--font-open-sans",
  display: "swap",
  src: [
    {
      path: "../public/fonts/open-sans-latin-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/open-sans-latin-Regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/open-sans-latin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/open-sans-latin-Bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

const robotoMono = localFont({
  variable: "--font-roboto-mono",
  display: "swap",
  src: [
    {
      path: "../public/fonts/roboto-mono-latin-Regular-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/roboto-mono-latin-Regular-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/roboto-mono-latin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/roboto-mono-latin-Bold-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
});

const notoSansSC = localFont({
  variable: "--font-noto-sans-sc",
  display: "swap",
  src: [
    {
      path: "../public/fonts/noto-sans-sc-chinese-simplified-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/noto-sans-sc-chinese-simplified-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

const wenQuanYiZenHei = localFont({
  variable: "--font-wqy-zenhei",
  display: "swap",
  src: [
    {
      path: "../public/fonts/WenQuanYiZenHei.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "PinResume",
  description: "纯前端简历编辑与打印工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${quicksand.variable} ${nunito.variable} ${openSans.variable} ${robotoMono.variable} ${notoSansSC.variable} ${wenQuanYiZenHei.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
