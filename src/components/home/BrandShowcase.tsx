'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { ChevronRight, ShieldCheck, Award } from 'lucide-react';
import { PaintBrand } from '@/types';

interface Props {
  selectedBrand: PaintBrand | 'All';
  onSelectBrand: (brand: PaintBrand | 'All') => void;
}

export default function BrandShowcase({ selectedBrand, onSelectBrand }: Props) {
  const { brands } = useStore();

  const brandLogos: Record<string, { logoText: string; color: string; bg: string; sub: string }> = {
    'Asian Paints': {
      logoText: 'ap asianpaints',
      color: '#DC2626',
      bg: 'bg-red-50 text-red-700',
      sub: 'Royale & Apcolite',
    },
    'Berger': {
      logoText: 'Berger',
      color: '#1E3A8A',
      bg: 'bg-blue-50 text-blue-800',
      sub: 'Silk & Easy Clean',
    },
    'Dulux': {
      logoText: "Dulux let's colour",
      color: '#0284C7',
      bg: 'bg-sky-50 text-sky-700',
      sub: 'Velvet Touch Pearl',
    },
    'Nerolac': {
      logoText: 'NEROLAC',
      color: '#0D9488',
      bg: 'bg-emerald-50 text-emerald-800',
      sub: 'Beauty Gold & Impressions',
    },
    'JSW': {
      logoText: 'JSW PAINTS',
      color: '#EA580C',
      bg: 'bg-orange-50 text-orange-800',
      sub: 'Halo Luxury Emulsion',
    },
    'Indigo': {
      logoText: 'INDIGO be surprised!',
      color: '#7C3AED',
      bg: 'bg-purple-50 text-purple-800',
      sub: 'Metallic & Dirtproof',
    },
  };

  return (
    <section id="brands-section" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Paint Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore premium quality paints from trusted national &amp; global manufacturers.
            </p>
          </div>

          {selectedBrand !== 'All' && (
            <button
              onClick={() => onSelectBrand('All')}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>Show All Brands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => {
            const info = brandLogos[brand.name] || {
              logoText: brand.name,
              color: '#334155',
              bg: 'bg-slate-50 text-slate-800',
              sub: brand.popularSeries,
            };
            const isSelected = selectedBrand === brand.name;

            return (
              <button
                key={brand.id}
                onClick={() => {
                  onSelectBrand(isSelected ? 'All' : brand.name);
                  const el = document.getElementById('colours-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative p-5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 h-36 ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 bg-white hover:shadow-lg hover:shadow-slate-900/5'
                }`}
              >
                {/* Brand Visual Identity */}
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div
                    className="text-base sm:text-lg font-black tracking-tighter"
                    style={{ color: info.color }}
                  >
                    {brand.name}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 mt-1 truncate max-w-[120px]">
                    {info.sub}
                  </span>
                </div>

                {/* Arrow Icon button bottom */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
