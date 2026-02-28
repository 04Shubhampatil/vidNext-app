import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "VidFlow",
    template: "%s | VidFlow",
  },
  description:
    "A modern web application built with Next.js that helps users manage tasks, explore features, and improve productivity.",
  icons: {
    icon: "https://cdn-icons-png.flaticon.com/128/2839/2839026.png", // replace with your logo file path
    apple: "/apple-icon.png",
  },
  keywords: [
    "Next.js",
    "React",
    "Web App",
    "Productivity",
    "JavaScript",
  ],
  authors: [{ name: "shubham patil" }],
  creator: "shubham patil",
  openGraph: {
    title: "VidFlow",
    description: "A modern web application built with Next.js.",
    url: "https://yourdomain.com",
    siteName: "VidFlow",
    type: "website",
    images: [
      {
        url: "https://cdn-icons-png.flaticon.com/128/2839/2839026.png", // reference the logo here
        width: 800,
        height: 600,
        alt: "VidFlow Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VidFlow",
    description: "A modern web application built with Next.js.",
   
  },
  robots: {
    index: true,
    follow: true,
  },
};export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        <Provider>
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
