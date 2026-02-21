import SiteWrapper from "@/components/layout/SiteWrapper";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "YuvaGlow Professional Co. — Premium Salon Beauty",
    template: "%s | YuvaGlow",
  },
  description:
    "Premium salon-grade hair care and beauty products crafted with nature's finest botanicals. Cruelty-free. Professional. Luxurious.",
  keywords: ["hair care", "salon products", "YuvaGlow", "premium hair care", "Indian beauty", "beauty brand"],
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
        <SiteWrapper>
          {children}
        </SiteWrapper>
      </body>
    </html>
  );
}
