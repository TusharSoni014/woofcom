import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Provider from "./provider";
import Header from "@/components/Header";
import StoreProvider from "./StoreProvider";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WoofCom - Stylish Clothing",
  description:
    "Discover trendy and comfortable clothing at WoofCom, your go-to ecommerce store for latest fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          forcedTheme="light"
        >
          <Provider>
            <StoreProvider>
              <Header />
              {children}
              <Footer />
            </StoreProvider>
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
