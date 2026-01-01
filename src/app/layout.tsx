import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { StyledComponentsProvider } from "@/components/providers/StyledComponentsProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { ErrorBoundaryProvider } from "@/components/providers/ErrorBoundaryProvider";
import "@/styles/performance.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arts by Jeeva - Hand-drawn Anime & Portrait Art",
  description: "Immersive portfolio showcasing hand-drawn pencil sketches, anime artworks, portraits, and realism pieces by Jeeva. Experience art in an elegant gallery setting.",
  keywords: ["sketch", "anime art", "portrait", "pencil drawing", "hand-drawn", "art portfolio", "jeeva", "artist"],
  authors: [{ name: "Jeeva" }],
  robots: "index, follow",
  openGraph: {
    title: "Arts by Jeeva - Hand-drawn Anime & Portrait Art",
    description: "Immersive portfolio showcasing hand-drawn pencil sketches by Jeeva in an elegant gallery setting.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <StyledComponentsProvider>
          <ErrorBoundaryProvider>
            <LenisProvider>
              {children}
            </LenisProvider>
          </ErrorBoundaryProvider>
        </StyledComponentsProvider>
      </body>
    </html>
  );
}
