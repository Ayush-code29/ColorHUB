'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { ChevronRight } from 'lucide-react';
import { PaintBrand } from '@/types';

interface Props {
  selectedBrand: PaintBrand | 'All';
  onSelectBrand: (brand: PaintBrand | 'All') => void;
}

export default function BrandShowcase({ selectedBrand, onSelectBrand }: Props) {
  const { brands } = useStore();

  // If no brands are added from the admin panel yet, do not render the section
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section id="brands-section" className="py-12 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Top Paint Brands
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore premium quality paints from trusted manufacturers.
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

        {/* Brand Cards Grid - ONLY shows brands added in admin panel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => {
            const isSelected = selectedBrand === brand.name;
            const accentColor = brand.accentColor || '#1e293b';

            return (
              <button
                key={brand.id || brand.name}
                type="button"
                onClick={() => {
                  onSelectBrand(isSelected ? 'All' : brand.name);
                  const el = document.getElementById('colours-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`group relative p-5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all duration-300 min-h-[144px] ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30 shadow-md'
                    : 'border-slate-200/90 hover:border-slate-300 bg-white hover:shadow-lg hover:shadow-slate-900/5'
                }`}
              >
                {/* Brand Visual Identity */}
                <div className="flex-1 flex flex-col items-center justify-center w-full px-1">
                  

                  <div
                    className="text-base sm:text-lg font-black tracking-tighter truncate max-w-full"
                    style={{ color: accentColor }}
                  >
                    {brand.name}
                  </div>

                  <span className="text-[10px] font-medium text-slate-500 mt-1 line-clamp-2 max-w-[140px] leading-tight">
                    {brand.tagline || brand.popularSeries || 'Quality Paints'}
                  </span>
                </div>

                {/* Arrow Icon button bottom */}
                <div
                  className={`mt-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
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
