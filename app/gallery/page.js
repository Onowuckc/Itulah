'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function GalleryPage() {
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Wild Octopus Herbal Liqueur (Original Edition)',
      category: 'Beverages',
      description: 'The iconic bottle design and signature botanical blend of Wild Octopus Liqueur.',
      image: '/img/wildOctopus1.jpeg',
      brochure: '/brochures/Wild_Octopus_Beverages.pdf'
    },
    {
      id: 2,
      title: 'Wild Octopus Special Reserve',
      category: 'Beverages',
      description: 'Premium barrel-matured herbal liqueur crafted for celebration and luxury nightlife.',
      image: '/img/WildOctopus2.jpeg',
      brochure: '/brochures/Wild_Octopus_Beverages.pdf'
    },
    {
      id: 3,
      title: 'Wild Octopus Premium Craft Bottle',
      category: 'Beverages',
      description: 'Exclusive custom label branding and crystal glass craft presentation for Wild Octopus.',
      image: '/img/WildOctopus.png',
      brochure: '/brochures/Wild_Octopus_Beverages.pdf'
    },
    {
      id: 4,
      title: 'Aromatic Fragrance Oil Collection (N° 1)',
      category: 'Fragrances & Flavours',
      description: 'Pure essential oil formulation imported from premier international perfume houses.',
      image: '/img/fragrance1.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 5,
      title: 'Fine Fragrance Essence Blend (N° 2)',
      category: 'Fragrances & Flavours',
      description: 'High-concentration aromatic oils tailored for cosmetics, soaps, and luxury perfumery.',
      image: '/img/Fragrance2.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 6,
      title: 'Royal Velvet Floral Fragrance (N° 3)',
      category: 'Fragrances & Flavours',
      description: 'Deep floral tones featuring jasmine, rose, and amber base accords for fine beauty products.',
      image: '/img/Fragrance3.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 7,
      title: 'Citrus & Botanical Flavour Oil (N° 4)',
      category: 'Fragrances & Flavours',
      description: 'Vibrant zesty citrus notes designed for beverages, confectionery, and personal care lines.',
      image: '/img/fragrance4.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 8,
      title: 'Exotic Amber & Spice Essence (N° 5)',
      category: 'Fragrances & Flavours',
      description: 'Rich oriental spicy fragrance profile crafted for luxury unisex body sprays and candles.',
      image: '/img/fragrance5.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 9,
      title: 'Oceanic Breeze Eau De Parfum Oils (N° 6)',
      category: 'Fragrances & Flavours',
      description: 'Crisp aquatic fragrance notes bringing long-lasting freshness to personal care products.',
      image: '/img/Fragrance6.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 10,
      title: 'Golden Vanilla & Sandalwood Oil (N° 7)',
      category: 'Fragrances & Flavours',
      description: 'Smooth gourmand fragrance notes blending sweet vanilla bean with warm mysore sandalwood.',
      image: '/img/fragrance7.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 11,
      title: 'Pure Botanical Extract Concentrate (N° 8)',
      category: 'Fragrances & Flavours',
      description: '100% pure organic aromatic extracts for premium healthcare and aromatherapy applications.',
      image: '/img/fragrance8.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 12,
      title: 'Midnight Musk Fine Perfumery (N° 9)',
      category: 'Fragrances & Flavours',
      description: 'Sensual musk notes for high-end designer fragrances and premium body spray manufacturing.',
      image: '/img/fragrance9.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 13,
      title: 'Tropical Fruit Essence Extract (N° 10)',
      category: 'Fragrances & Flavours',
      description: 'Lush tropical flavour oil accords created for food & beverage flavoring solutions.',
      image: '/img/fragrance10.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 14,
      title: 'Fresh Herbal & Green Tea Notes (N° 11)',
      category: 'Fragrances & Flavours',
      description: 'Revitalizing green leaf scent profile for spa lines and premium hotel amenities.',
      image: '/img/fragrance11.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 15,
      title: 'Luxury Cedarwood & Leather Oil (N° 12)',
      category: 'Fragrances & Flavours',
      description: 'Sophisticated woody leather accords for premium men’s grooming and prestige fragrances.',
      image: '/img/fragrance12.jpeg',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 16,
      title: 'Alcoholic Beverages Collection',
      category: 'Beverages',
      description: 'Imported and locally blended spirits including Country Pride gin, classic and cinnamon whiskeys.',
      image: '/img/alcoholic beverages.png',
      brochure: '/brochures/Country_Pride_Spirits.pdf'
    },
    {
      id: 17,
      title: 'CCTV & Surveillance Cameras',
      category: 'Security Solutions',
      description: 'Full range of smart IP cameras, pan-tilt-zoom directional cameras, covert recorders, and network interfaces.',
      image: '/img/cctv.png',
      brochure: '/brochures/CCTV_Surveillance_Solutions.pdf'
    },
    {
      id: 18,
      title: 'Locks & Physical Hardware',
      category: 'Security Solutions',
      description: 'German-engineered padlocks, container lock systems, mortice handles, and combination lockboxes.',
      image: '/img/physical locks.png',
      brochure: '/brochures/Locks_Physical_Security.pdf'
    },
    {
      id: 19,
      title: 'Fire Alarm & Safety Detection',
      category: 'Fire Safety',
      description: 'Optical smoke detectors, wireless trigger stations, extinguishers, panels, and heat warning bells.',
      image: '/img/FireAlarm.png',
      brochure: '/brochures/Fire_Safety_Systems.pdf'
    },
    {
      id: 20,
      title: 'Telecommunication (PABX Landline)',
      category: 'Telecommunications',
      description: 'Samsung and Gigaset office PBX telephone interfaces, IP handsets, and modular control stations.',
      image: '/img/communicationAndLandline.png',
      brochure: '/brochures/PABX_Telephony_Catalog.pdf'
    },
    {
      id: 21,
      title: 'Wendie & Frais Body Sprays',
      category: 'Fragrances & Flavours',
      description: 'Personal body spray lines distributed directly across major supermarkets and outlets.',
      image: '/img/bodySpray.png',
      brochure: '/brochures/Body_Sprays_Retail.pdf'
    },
    {
      id: 22,
      title: 'PULS Sports Nutrition',
      category: 'Consumer Goods',
      description: 'Whey protein isolates, workout supplement packs, and brand shakers for athletes.',
      image: '/img/Nutrition.png',
      brochure: '/brochures/PULS_Nutrition_Nigeria.pdf'
    }
  ];

  // Helper to handle download of a mock PDF
  const handleDownload = (e, item) => {
    e.stopPropagation();
    // In a real application, this triggers download. 
    // Here we will generate a download of a dynamic small text file named after the PDF to simulate the brochure delivery!
    const content = `Itulah Nigeria Limited Brochure\n\nTitle: ${item.title}\nCategory: ${item.category}\nDescription: ${item.description}\n\nFor more details, contact Info@itulahng.com or call +234 807 963 5408, +234 812 449 1283.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = item.brochure.split('/').pop().replace('.pdf', '_brochure.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h1 className={styles.title}>Visual Gallery</h1>
        <p className={styles.subtitle}>Explore our products and download our corporate brochures</p>
      </div>

      <div className={styles.categoryGrid}>
        {galleryItems.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper} onClick={() => setActiveImage(item)} style={{ padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.45)' }}>
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 350px"
                className={styles.cardBg}
                style={{ objectFit: 'contain', padding: '15px' }}
              />
            </div>
            <div className={styles.cardBody}>
              <span style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '6px', letterSpacing: '1px' }}>
                {item.category}
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.description}</p>
              <div className={styles.btnGroup}>
                <button className={styles.previewBtn} onClick={() => setActiveImage(item)}>
                  Zoom View
                </button>
                <button className={styles.downloadBtn} onClick={(e) => handleDownload(e, item)}>
                  Brochure (PDF)
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div className={styles.modal} onClick={() => setActiveImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setActiveImage(null)}>
              &times;
            </button>
            <div style={{ position: 'relative', width: '80vw', height: '70vh', maxWidth: '900px' }}>
              <Image
                src={activeImage.image}
                alt={activeImage.title}
                fill
                className={styles.modalImage}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div className={styles.caption}>
              {activeImage.title} ({activeImage.category})
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
