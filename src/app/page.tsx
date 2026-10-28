
'use client';

import { useState } from 'react';

import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/home/HeroBanner';
import PromoCards from '@/components/home/PromoCards';
import BrandShowcase from '@/components/home/BrandShowcase';
import OurWork from '@/components/home/OurWork';
import ColourExplorer from '@/components/colours/ColourExplorer';
import RoomVisualizer from '@/components/visualizer/RoomVisualizer';
import ShadeCardsSection from '@/components/home/ShadeCardsSection';
import InspirationGallery from '@/components/gallery/InspirationGallery';
import Footer from '@/components/layout/Footer';

import type { PaintBrand } from '@/types';

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand | 'All'>(
    'All'
  );

  const handleBrandSelect = (brand: PaintBrand | 'All') => {
    setSelectedBrand(brand);
  };

  const handleViewShades = (brand: PaintBrand | 'All') => {
    setSelectedBrand(brand);

    // Scroll after the selected brand state has been updated.
    requestAnimationFrame(() => {
      document.getElementById('colours-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero */}
        <HeroBanner />

        {/* 2. Promotional cards */}
        <PromoCards />

        {/* 3. Brand selection */}
        <BrandShowcase
          selectedBrand={selectedBrand}
          onSelectBrand={handleBrandSelect}
        />

        {/* 4. Room colour visualizer */}
        <RoomVisualizer />

        {/* 5. Admin-managed work gallery */}
        <OurWork onSelectBrand={handleViewShades} />

        {/* 6. Colour catalogue */}
        <section id="colours-section" className="scroll-mt-24">
          <ColourExplorer
            selectedBrand={selectedBrand}
            onSelectBrand={handleBrandSelect}
          />
        </section>

        {/* 7. Downloadable shade cards and colour books */}
        <ShadeCardsSection />

        {/* 8. Inspiration gallery */}
        <InspirationGallery />
      </main>

      <Footer />
    </div>
  );
}
