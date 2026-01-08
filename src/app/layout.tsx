import type { Metadata, Viewport } from "next";
import { MobileNav } from "@/components/layout/MobileNav";
import { Header } from "@/components/layout/Header";
import { ChatAssistant } from "@/components/ChatAssistant";
import { PublicChatBanner } from "@/components/PublicChatBanner";
import { AdminProvider } from "@/contexts/AdminContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chamiza 2026 - Reunion Familiar",
  description:
    "Reunion familiar Chamiza 2026 en Hacienda San Pedro Palomeque, Merida Yucatan",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chamiza 2026",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2B4B3C",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-cream">
        <AdminProvider>
          <Header />
          <PublicChatBanner />
          <main className="pb-20">{children}</main>
          <ChatAssistant />
          <MobileNav />
        </AdminProvider>
      </body>
    </html>
  );
}
