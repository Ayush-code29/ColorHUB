"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accentShade: string;
  accentHex: string;
};

export default function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const { openConsultationModal } = useStore();

  const loadSlides = useCallback(async () => {
    try {
      const response = await fetch("/api/hero-slides", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to fetch hero slides.");
      }

      const data = await response.json();

      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Hero slides loading failed:", error);
      setSlides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlides();
  }, [loadSlides]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    if (slides.length <= 1) return;

    setCurrentSlide((previous) => (previous + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length <= 1) return;

    setCurrentSlide(
      (previous) => (previous - 1 + slides.length) % slides.length
    );
  };

  if (loading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div className="relative h-[480px] w-full sm:h-[540px] md:h-[620px]">
        {slides.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              fetchPriority={index === currentSlide ? "high" : "auto"}
              loading={index === currentSlide ? "eager" : "lazy"}
              className="h-full w-full object-cover brightness-[0.82]"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ))}

        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-md">
              <span
                className="h-3 w-3 rounded-full border border-white/40"
                style={{ backgroundColor: slide.accentHex }}
              />
              <span>Featured Shade: {slide.accentShade}</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.12] tracking-tight drop-shadow-sm sm:text-5xl lg:text-6xl">
              {slide.title}
            </h1>

            <p className="max-w-xl text-sm font-normal leading-relaxed text-slate-200 drop-shadow-xs sm:text-base md:text-lg">
              {slide.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 sm:gap-4">
              <a
                href="#colours-section"
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-600/30 transition-all hover:translate-x-0.5 hover:bg-amber-500"
              >
                <span>Explore Colours</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#room-visualizer"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/25"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Test in Room Visualizer</span>
              </a>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/40"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/40"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-2">
              {slides.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? "w-8 bg-amber-500"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}