'use client';

import React from 'react';
import { FileText, ExternalLink, Download, Sparkles, BookOpen } from 'lucide-react';

interface ShadeCardItem {
  id: string;
  title: string;
  category: string;
  description: string;
  pdfUrl: string;
  fileSize: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  featured?: boolean;
}

const SHADE_CARDS: ShadeCardItem[] = [
  {
    id: 'royale',
    title: 'Royale Luxury Shade Card',
    category: 'Luxury Interior',
    description: 'Exclusive designer palette with velvet sheens, metallic finishes and ultra-smooth luxury emulsions.',
    pdfUrl: '/Royale-Shade-Card-PDF-new.pdf',
    fileSize: '21.0 MB',
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-200',
    featured: true,
  },
  {
    id: 'master-guide',
    title: 'Colour Combinations Master Guide',
    category: 'Designer Pairings',
    description: 'Curated 2-tone and 3-tone wall palettes for living rooms, master bedrooms, kitchens and hallways.',
    pdfUrl: '/Master%20file_%20Interior%20Colour%20combination.pdf',
    fileSize: '24.7 MB',
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    accentBorder: 'border-rose-200',
    featured: true,
  },
  {
    id: 'interior',
    title: 'Interior Wall Shade Card',
    category: 'Interior Emulsions',
    description: 'Comprehensive shade index featuring modern neutrals, warm terracottas, and botanical pastels.',
    pdfUrl: '/Interior%20Shade%20Card.pdf',
    fileSize: '1.2 MB',
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-200',
  },
  {
    id: 'apex',
    title: 'Apex Exterior Weatherproof Card',
    category: 'Exterior Defence',
    description: 'UV-resistant and anti-fungal exterior shades designed to endure extreme heat and heavy monsoons.',
    pdfUrl: '/apex-shade-card.pdf',
    fileSize: '1.3 MB',
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-200',
  },
  {
    id: 'tractor',
    title: 'Tractor Emulsion Shade Card',
    category: 'Value Interior',
    description: 'Popular budget-friendly matte and satin shades with high coverage and smooth washable texture.',
    pdfUrl: '/tractor-shade-card.pdf',
    fileSize: '1.7 MB',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    accentBorder: 'border-purple-200',
  },
];

export default function ShadeCardsSection() {
  return (
    <section id="shade-cards-section" className="py-16 bg-slate-50/80 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Official Catalogues &amp; Fandecks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Download Shade Cards &amp; Colour Books
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              View official shade guides, complete colour fandecks and room combination books to choose the exact shade for your space.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            <span>5 Official PDF Catalogues Available</span>
          </div>
        </div>

        {/* Shade Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SHADE_CARDS.map((card) => (
            <div
              key={card.id}
              className={`rounded-2xl border bg-white p-6 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group ${
                card.featured ? 'border-amber-200/90 ring-1 ring-amber-500/10' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${card.accentBg} ${card.accentText} border ${card.accentBorder} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {card.category}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-1">
                      PDF • {card.fileSize}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={card.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open &amp; View</span>
                </a>
                <a
                  href={card.pdfUrl}
                  download
                  className="py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
