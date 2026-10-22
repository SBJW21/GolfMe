import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Golf Me | Find a golf coach in Sydney",
    template: "%s | Golf Me",
  },
  description:
    "Compare golf coaches in Sydney, read reviews and book lessons online.",
  metadataBase: new URL("https://golfme.com.au"),
  openGraph: {
    title: "Golf Me | Find a golf coach in Sydney",
    description:
      "Compare golf coaches in Sydney, read reviews and book lessons online.",
    url: "https://golfme.com.au",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:ital,wght@0,700;0,800;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
