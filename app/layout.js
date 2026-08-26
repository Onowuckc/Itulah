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
    default: "Itulah Nigeria Limited | Wild Octopus Liqueur, Fragrance & Nutrition Solutions",
    template: "%s | Itulah Nigeria Limited",
  },
  description: "Itulah Nigeria Limited provides Wild Octopus Liqueur, fine fragrances, body sprays, and PULS Nutrition supplements across Nigeria since 1989.",
  keywords: [
    "Wild Octopus Liqueur",
    "Itulah Nigeria Limited",
    "Fragrance products Nigeria",
    "PULS Nutrition Nigeria",
    "Country Pride Gin",
    "Spiced Whiskey Nigeria"
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
    title: "Itulah Nigeria Limited | Wild Octopus Liqueur & Fine Fragrances",
    description: "Delivering premium alcoholic beverages like Wild Octopus Liqueur, fine fragrances, and nutrition supplements since 1989.",
    siteName: "Itulah Nigeria Limited",
    images: [
      {
        url: "/img/wildOctopus1.jpeg",
        width: 1200,
        height: 630,
        alt: "Wild Octopus Liqueur - Itulah Nigeria Limited",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Itulah Nigeria Limited | Wild Octopus Liqueur & Fine Fragrances",
    description: "Nigeria's trusted enterprise for Wild Octopus Liqueur, fine fragrances, and nutrition supplements.",
    images: ["/img/wildOctopus1.jpeg"],
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
        "url": "https://itulah.com.ng",
        "logo": "https://itulah.com.ng/img/logo.png",
        "foundingDate": "1989-01-01",
        "description": "Leading Nigerian enterprise specializing in Wild Octopus Liqueur distribution, fine fragrances, and PULS nutrition supplements.",
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
        "image": "https://itulah.com.ng/img/wildOctopus1.jpeg",
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

