'use client';

import { useState, useEffect } from 'react';

export default function AnimatedBackground() {
  const modes = ['fusion', 'steel', 'gold'];
  const [modeIndex, setModeIndex] = useState(0);
  const [focusClass, setFocusClass] = useState('');

  useEffect(() => {
    // Automatically swap out ambient background mode between fusion, steel, and gold every 8 seconds
    const interval = setInterval(() => {
      setModeIndex((prevIndex) => (prevIndex + 1) % modes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [modes.length]);

  useEffect(() => {
    // Optional focus event from division hovers
    const handleBgFocus = (e) => {
      if (e.detail && e.detail.division) {
        setFocusClass(`bg-focus-${e.detail.division}`);
      } else {
        setFocusClass('');
      }
    };

    window.addEventListener('itulah-bg-focus', handleBgFocus);
    return () => window.removeEventListener('itulah-bg-focus', handleBgFocus);
  }, []);

  const currentMode = modes[modeIndex];

  return (
    <div className={`animated-bg-container bg-mode-${currentMode} ${focusClass}`}>
      <div className="bg-ambient-light" />
      <div className="bg-layer bg-layer-1" title="Security & Tech Matrix Grid (background1.jpg)" />
      <div className="bg-layer bg-layer-2" title="Azure Steel & Telecom Texture (background2.jpg)" />
      <div className="bg-layer bg-layer-3" title="Liquid Gold & Fragrance Curves (background3.jpg)" />
      <div className="bg-overlay" />
    </div>
  );
}
