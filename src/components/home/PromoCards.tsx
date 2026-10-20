'use client';

import React from 'react';
import { ArrowRight, Sparkles, Percent, Calendar } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function PromoCards() {
  const { openConsultationModal } = useStore();

  return (
    <section id="offers-section" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Festive Offer */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border border-rose-100 p-6 flex flex-col justify-between group hover:shadow-xl hover:shadow-orange-950/5 transition-all">
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">
                Festive Offer
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                Up to 30% OFF on selected products
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Royale &amp; Silk luxury series festive savings
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between relative z-10">
              <a
                href="#colours-section"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Paint can realistic graphic */}
              <div className="relative w-28 h-24 flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-amber-600 via-rose-700 to-amber-900 shadow-md border-t-4 border-amber-300 relative flex flex-col justify-between p-1.5 text-center">
                  <div className="h-1.5 w-full bg-white/30 rounded-full" />
                  <span className="text-[9px] font-black tracking-widest text-amber-100 uppercase">
                    Royale
                  </span>
                  <div className="h-1 w-full bg-amber-400/40 rounded-full" />
                </div>
                <div className="w-14 h-18 -ml-3 rounded-xl bg-gradient-to-b from-red-600 via-rose-600 to-red-800 shadow-lg border-t-4 border-white/50 relative flex flex-col justify-between p-1 text-center">
                  <span className="text-[8px] font-black text-white uppercase">Apcolite</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Free Home Colour Consultation */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-50 border border-emerald-100 p-6 flex flex-col justify-between group hover:shadow-xl hover:shadow-emerald-950/5 transition-all">
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                Expert Guidance
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                Free Home Colour Consultation
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Get expert suggestions for your space
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between relative z-10">
              <button
                onClick={openConsultationModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors"
              >
                <span>Book Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Realistic interior armchair image */}
              <div className="relative w-28 h-24 rounded-2xl overflow-hidden shadow-sm border border-emerald-200/50">
                <img
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80"
                  alt="Interior consultation decor"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Card 3: New Arrivals */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 border border-amber-100 p-6 flex flex-col justify-between group hover:shadow-xl hover:shadow-amber-950/5 transition-all">
            <div className="relative z-10">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
                Curated 2026 Trends
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                New Arrivals &amp; Velvet Sheens
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Explore the latest shades and finishes
              </p>
            </div>

            <div className="mt-8 flex items-end justify-between relative z-10">
              <a
                href="#colours-section"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors"
              >
                <span>View Collection</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* Paint can realistic graphic */}
              <div className="relative w-28 h-24 flex items-center justify-center">
                <div className="w-16 h-20 rounded-xl bg-gradient-to-b from-blue-700 via-sky-800 to-indigo-900 shadow-md border-t-4 border-sky-300 relative flex flex-col justify-between p-1.5 text-center">
                  <div className="h-1.5 w-full bg-white/30 rounded-full" />
                  <span className="text-[9px] font-black tracking-widest text-sky-100 uppercase">
                    Dulux
                  </span>
                  <div className="h-1 w-full bg-sky-400/40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
