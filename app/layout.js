import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import Providers from "@/components/Providers";
import CartDrawer from "@/components/CartDrawer";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080c14",
};

export const metadata = {
  metadataBase: new URL("https://itulah.com.ng"),
  title: {
    default: "Itulah Nigeria Limited | CCTV Installation, Wild Octopus Liqueur & Fragrance Solutions",
    template: "%s | Itulah Nigeria Limited",
  },
  description: "Itulah Nigeria Limited (formerly Mikado Nigeria Limited) provides professional CCTV installation in Nigeria, Wild Octopus Liqueur, electronic security, PABX communication systems, fine fragrances, and PULS Nutrition supplements since 1989.",
  keywords: [
    "Wild Octopus Liqueur",
    "CCTV installation in Nigeria",
    "Itulah Nigeria Limited",
    "Mikado Nigeria Limited",
    "Security solutions Lagos",
    "PABX Samsung systems Nigeria",
    "Fragrance products Nigeria",
    "PULS Nutrition Nigeria",
    "Country Pride Gin",
    "Spiced Whiskey Nigeria",
    "Industrial cleaning solutions Nigeria",
    "Abus locks Nigeria",
    "Smart home security Lagos",
    "Access control systems Lagos",
    "Intrusion alarm installation Nigeria"
  ],
  authors: [{ name: "Itulah Nigeria Limited" }],
  creator: "Itulah Nigeria Limited",
  publisher: "Itulah Nigeria Limited",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://itulah.com.ng",
    title: "Itulah Nigeria Limited | Wild Octopus Liqueur & CCTV Installation in Nigeria",
    description: "Delivering world-class security solutions, CCTV installation in Nigeria, premium alcoholic beverages like Wild Octopus Liqueur, fine fragrances, and nutrition supplements since 1989.",
    siteName: "Itulah Nigeria Limited",
    images: [
      {
        url: "/img/cctv.png",
        width: 1200,
        height: 630,
        alt: "Itulah Nigeria Limited - CCTV Installation & Security Solutions",
      },
      {
        url: "/img/WildOctopus.png",
        width: 1200,
        height: 630,
        alt: "Wild Octopus Liqueur - Itulah Nigeria Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itulah Nigeria Limited | CCTV Installation & Wild Octopus Liqueur",
    description: "Nigeria's trusted enterprise for CCTV installation, Wild Octopus Liqueur, security solutions, and fine fragrances.",
    images: ["/img/cctv.png"],
  },
  alternates: {
    canonical: "https://itulah.com.ng",
  },
};

export default function RootLayout({ children }) {
  // Schema.org Structured Data for Google Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://itulah.com.ng/#organization",
        "name": "Itulah Nigeria Limited",
        "alternateName": "Mikado Nigeria Limited",
        "url": "https://itulah.com.ng",
        "logo": "https://itulah.com.ng/img/logo.png",
        "foundingDate": "1989-01-01",
        "description": "Leading Nigerian enterprise specializing in electronic security, CCTV installation in Nigeria, Wild Octopus Liqueur distribution, PABX systems, and fine fragrances.",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+234-807-963-5408",
          "contactType": "customer service",
          "areaServed": "NG",
          "availableLanguage": "English"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://itulah.com.ng/#localbusiness",
        "name": "Itulah Nigeria Limited",
        "image": "https://itulah.com.ng/img/cctv.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Plot 4 block 11 prince adesoji ajose street ogudu phase 2",
          "addressLocality": "Lagos",
          "addressCountry": "NG"
        },
        "priceRange": "₦₦₦",
        "telephone": "+234-807-963-5408"
      },
      {
        "@type": "WebSite",
        "@id": "https://itulah.com.ng/#website",
        "url": "https://itulah.com.ng",
        "name": "Itulah Nigeria Limited",
        "publisher": {
          "@id": "https://itulah.com.ng/#organization"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}

