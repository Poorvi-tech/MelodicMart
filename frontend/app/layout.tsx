import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/WhatsAppWidget";
import BubbleAnimation from "@/components/BubbleAnimation";
import FloatingInteractiveButton from "@/components/FloatingInteractiveButton";

export const metadata: Metadata = {
  title: "Music Haven - Premium Musical Instruments Store | Buy Guitars, Flutes, Tabla & More",
  description: "Discover authentic musical instruments at Music Haven. Shop guitars, violins, flutes, tabla, harmonium, keyboards and more. Premium quality, fast shipping across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <BubbleAnimation />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <FloatingInteractiveButton />
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}