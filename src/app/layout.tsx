import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Nav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chat-with-api-by-sukh.vercel.app'),
  title: "Chat with API - Securely Interact with Your API Key",
  description: "Chat with your API key securely and efficiently.",
  icons: {
    icon: '/favicon.ico',
  },
  applicationName: "Chat with API",
  keywords: "Chat with API, interact with API key, secure API chat",
  authors: [{ name: "Sukhjit Singh", url: "https://sukhjitsingh.me" }],
  creator: "Sukhjit Singh",
  openGraph: {
    title: "Chat with API - Securely Interact with Your API Key",
    description: "Chat with your API key securely and efficiently.",
    url: "https://chat-with-api-by-sukh.vercel.app/",
    siteName: "Chat with API",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chat with API Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with API - Securely Interact with Your API Key",
    description: "Chat with your API key securely and efficiently.",
    images: ["/og-image.png"],
    creator: "@thesukhjitbajwa",
  },

};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F172A" />
        <meta property="og:title" content="Chat with API - Securely Interact with Your API Key" />
        <meta property="og:description" content="Chat with your API key securely and efficiently." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="keywords" content="Chat with API, interact with API key, secure API chat" />
        <meta name="author" content="Sukhjit Singh" />
        <meta name="application-name" content="Chat with API" />
        <meta name="url" content="https://chat-with-api-by-sukh.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-blue-600`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
