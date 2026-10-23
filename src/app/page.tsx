'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import HeroBanner from '@/components/home/HeroBanner';
import PromoCards from '@/components/home/PromoCards';
import BrandShowcase from '@/components/home/BrandShowcase';
import ColourExplorer from '@/components/colours/ColourExplorer';
import RoomVisualizer from '@/components/visualizer/RoomVisualizer';
import InspirationGallery from '@/components/gallery/InspirationGallery';
import ShadeCardsSection from '@/components/home/ShadeCardsSection';
import Footer from '@/components/layout/Footer';
import { PaintBrand } from '@/types';

export default function HomePage() {
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand | 'All'>('All');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Hero Banner (top-left mockup) */}
        <HeroBanner />

        {/* 2. Promo Cards Row (Festive 30%, Free Consultation, New Arrivals) */}
        <PromoCards />

        {/* 3. Top Paint Brands (middle-left mockup) */}
        <BrandShowcase
          selectedBrand={selectedBrand}
          onSelectBrand={(brand) => setSelectedBrand(brand)}
        />

        {/* 4. Room Colour Visualizer (middle-center mockup) */}
        <RoomVisualizer />

        {/* 5. Explore Colours Catalogue (top-right mockup) */}
        <ColourExplorer
          selectedBrand={selectedBrand}
          onSelectBrand={(brand) => setSelectedBrand(brand)}
        />

        {/* 6. Official Downloadable Shade Cards & Colour Books */}
        <ShadeCardsSection />

        {/* 7. Inspiration Gallery (bottom-left mockup) */}
        <InspirationGallery />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
