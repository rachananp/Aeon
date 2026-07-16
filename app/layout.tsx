import type { Metadata } from "next";
import "./globals.css";
import { CursorProvider } from "@/components/CursorProvider";
import SmoothScroll from "@/components/SmoothScroll";
import ParticleField from "@/components/ParticleField";
import CursorGlow from "@/components/CursorGlow";

export const metadata: Metadata = {
  title: "AEON VITAE — Continuum Health (Meridian-9, 2091)",
  description:
    "A speculative-fiction interface imagined for the arcology of Meridian-9, year 2091. AEON VITAE is a fictional biomedical system administered by the fictional Continuum Accord — no real implant, device, or medical technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-void text-bone font-body overflow-x-hidden">
        <CursorProvider>
          <SmoothScroll>
            <ParticleField />
            <CursorGlow />
            {children}
          </SmoothScroll>
        </CursorProvider>
      </body>
    </html>
  );
}
