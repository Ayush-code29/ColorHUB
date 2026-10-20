'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Palette } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const HERO_SLIDES = [
  {
    title: 'Beautiful Spaces Start with the Right Colour',
    subtitle: 'Explore premium paints, expert advice and find the perfect colour for your home.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
    accentShade: 'Terracotta • AP-450',
    accentHex: '#BE674B',
  },
  {
    title: 'Tranquil Bedrooms Crafted in Fresh Botanical Hues',
    subtitle: 'Ultra-smooth low-odour luxury emulsions engineered for restful, restorative sleep.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85',
    accentShade: 'Sage Green • AP-234',
    accentHex: '#9EAA96',
  },
  {
    title: 'Warm Architectural Neutrals for Modern Living',
    subtitle: 'Timeless tones that reflect natural sunlight and complement contemporary wooden furnishings.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85',
    accentShade: 'Warm Beige • BRG-112',
    accentHex: '#D5C4A1',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { openConsultationModal } = useStore();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-slate-900">
      {/* Background Slides */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[620px] w-full">
        {HERO_SLIDES.map((item, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover brightness-[0.82]"
            />
            {/* Subtle luxury vignette & gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-2xl text-white space-y-5">
            {/* Live active shade pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md">
              <span
                className="w-3 h-3 rounded-full border border-white/40"
                style={{ backgroundColor: slide.accentHex }}
              />
              <span>Featured Shade: {slide.accentShade}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] drop-shadow-sm">
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-200 font-normal max-w-xl leading-relaxed drop-shadow-xs">
              {slide.subtitle}
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#colours-section"
                className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all hover:translate-x-0.5"
              >
                <span>Explore Colours</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#room-visualizer"
                className="px-5 py-3.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Test in Room Visualizer</span>
              </a>
            </div>
          </div>
        </div>

        {/* Slider Controls (Arrows) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-md"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md flex items-center justify-center transition-all border border-white/20 shadow-md"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slider Indicator Dots */}
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
