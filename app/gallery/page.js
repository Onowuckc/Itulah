'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

export default function GalleryPage() {
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Wild Octopus Premium Liqueur',
      category: 'Beverages',
      description: 'Exclusive bottle designs and branding for our premium herbal liqueur.',
      image: '/img/WildOctopus.png',
      brochure: '/brochures/Wild_Octopus_Beverages.pdf'
    },
    {
      id: 2,
      title: 'Alcoholic Beverages Collection',
      category: 'Beverages',
      description: 'Imported and locally blended spirits including Country Pride gin, classic and cinnamon whiskeys.',
      image: '/img/alcoholic beverages.png',
      brochure: '/brochures/Country_Pride_Spirits.pdf'
    },
    {
      id: 3,
      title: 'CCTV & Surveillance Cameras',
      category: 'Security Solutions',
      description: 'Full range of smart IP cameras, pan-tilt-zoom directional cameras, covert recorders, and network interfaces.',
      image: '/img/cctv.png',
      brochure: '/brochures/CCTV_Surveillance_Solutions.pdf'
    },
    {
      id: 4,
      title: 'Locks & Physical Hardware',
      category: 'Security Solutions',
      description: 'German-engineered padlocks, container lock systems, mortice handles, and combination lockboxes.',
      image: '/img/physical locks.png',
      brochure: '/brochures/Locks_Physical_Security.pdf'
    },
    {
      id: 5,
      title: 'Fire Alarm & Safety Detection',
      category: 'Fire Safety',
      description: 'Optical smoke detectors, wireless trigger stations, extinguishers, panels, and heat warning bells.',
      image: '/img/FireAlarm.png',
      brochure: '/brochures/Fire_Safety_Systems.pdf'
    },
    {
      id: 6,
      title: 'Telecommunication (PABX Landline)',
      category: 'Telecommunications',
      description: 'Samsung and Gigaset office PBX telephone interfaces, IP handsets, and modular control stations.',
      image: '/img/communicationAndLandline.png',
      brochure: '/brochures/PABX_Telephony_Catalog.pdf'
    },
    {
      id: 7,
      title: 'Flavours & Aromatic Fragrances',
      category: 'Fragrances & Flavours',
      description: 'Raw essential oil imports and fragrance compounds for body, fabric, home, and oral care.',
      image: '/img/Fragrance.png',
      brochure: '/brochures/Fragrances_Flavours_Distribution.pdf'
    },
    {
      id: 8,
      title: 'Wendie & Frais Body Sprays',
      category: 'Fragrances & Flavours',
      description: 'Personal body spray lines distributed directly across major supermarkets and outlets.',
      image: '/img/bodySpray.png',
      brochure: '/brochures/Body_Sprays_Retail.pdf'
    },
    {
      id: 9,
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
    const content = `Itulah Nigeria Limited Brochure\n\nTitle: ${item.title}\nCategory: ${item.category}\nDescription: ${item.description}\n\nFor more details, contact info@itulah.com.ng or call +234 1 234 5678.`;
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
