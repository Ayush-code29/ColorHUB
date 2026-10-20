'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Bookmark, Sparkles, ArrowRight, Check } from 'lucide-react';
import { InspirationItem } from '@/types';

export default function InspirationGallery() {
  const { inspirations, setSelectedVisualizerColor, colors, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [bookmarked, setBookmarked] = useState<string[]>(['insp-1', 'insp-2']);

  const tabs = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Exterior', 'Office'];

  const filteredInspirations =
    activeTab === 'All'
      ? inspirations
      : inspirations.filter((item) => item.roomType.toLowerCase().includes(activeTab.toLowerCase()));

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter((b) => b !== id));
      showToast('Removed from saved inspiration boards', 'info');
    } else {
      setBookmarked([...bookmarked, id]);
      showToast('Saved to your inspiration board!', 'success');
    }
  };

  const handleApplyPalette = (item: InspirationItem) => {
    const matchedColor = colors.find((c) => c.id === item.primaryColorId) || colors[0];
    setSelectedVisualizerColor(matchedColor);
    const el = document.getElementById('room-visualizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    showToast(`Loaded "${item.title}" palette in Visualizer!`, 'success');
  };

  return (
    <section id="inspiration-section" className="py-16 bg-slate-50/70 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Inspiration Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Get inspired by real spaces, colour combinations and latest trends.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Grid (matches bottom-left mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {filteredInspirations.map((item) => {
            const isSaved = bookmarked.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleApplyPalette(item)}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Room Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Bookmark icon */}
                  <button
                    onClick={(e) => toggleBookmark(item.id, e)}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSaved
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'bg-white/80 hover:bg-white text-slate-600 shadow-xs backdrop-blur-xs'
                    }`}
                    title={isSaved ? 'Bookmarked' : 'Bookmark Look'}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>

                  {/* Palette Swatches Bar Overlay on hover */}
                  <div className="absolute inset-x-2 bottom-2 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1">
                      {item.palette.map((hex, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-md border border-black/10 shadow-xs"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 flex items-center gap-1">
                      <span>Try Look</span>
                      <ArrowRight className="w-3 h-3 text-amber-600" />
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {item.paletteNames}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.roomType}</span>
                    <span className="text-amber-600 font-semibold group-hover:underline">
                      Visualizer &rarr;
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
