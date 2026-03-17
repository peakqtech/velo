import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tropica — Luxury Villas in Bali",
  description:
    "Discover handpicked luxury villas in Bali's most exclusive locations. Private pools, ocean views, and 24/7 concierge service.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {/* SVG Filters for Liquid Glass distortion effects */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            {/* Water-like refraction distortion */}
            <filter id="liquid-distortion">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.015 0.015"
                numOctaves="3"
                seed="2"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="12"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            {/* Stronger distortion for prominent elements */}
            <filter id="liquid-distortion-strong">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.012 0.012"
                numOctaves="4"
                seed="5"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="18"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            {/* Animated water distortion */}
            <filter id="liquid-distortion-animated">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.01"
                numOctaves="3"
                seed="1"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  dur="20s"
                  values="0.01 0.01;0.018 0.012;0.01 0.01"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}
