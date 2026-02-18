import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ChatBot from "@/components/shared/ChatBot";
import WhatsAppFloat from "@/components/shared/WhatsAppFloat";

export const metadata: Metadata = {
  title: {
    default: "YuvaGlow Professional Co. — Premium Salon Hair Care",
    template: "%s | YuvaGlow",
  },
  description:
    "Premium salon-grade hair care and beauty products crafted with nature's finest botanicals. Cruelty-free. Professional. Luxurious.",
  keywords: ["hair care", "salon products", "YuvaGlow", "premium hair care", "Indian beauty"],
  openGraph: {
    siteName: "YuvaGlow Professional Co.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" style={{ background: '#f5f2ed' }}>
        <Header />
        <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <ChatBot />
      </body>
    </html>
  );
}
