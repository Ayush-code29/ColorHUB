'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  Search,
  ShoppingBag,
  Heart,
  LayoutDashboard,
  Calculator,
  Sparkles,
  Menu,
  X,
  Palette,
  ArrowRight,
} from 'lucide-react';

export default function Navbar() {
  const {
    colors,
    cartItemsCount,
    wishlist,
    setIsCartOpen,
    openCalculatorModal,
    openProductModal,
    openConsultationModal,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search filter
  const searchResults = searchQuery.trim()
    ? colors.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Color<span className="text-amber-600">Hub</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
                Luxury Paints &amp; Decor
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <a href="#brands-section" className="hover:text-amber-600 transition-colors">
              Brands
            </a>
            <a href="#colours-section" className="hover:text-amber-600 transition-colors">
              Colours
            </a>
            <a href="#inspiration-section" className="hover:text-amber-600 transition-colors">
              Inspiration
            </a>
            <a href="#room-visualizer" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <span>Visualizer</span>
              <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded font-bold uppercase">
                AI
              </span>
            </a>
            <button
              onClick={openCalculatorModal}
              className="hover:text-amber-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Calculator</span>
            </button>
            <a href="#offers-section" className="hover:text-amber-600 transition-colors text-amber-600">
              Offers
            </a>
          </nav>

          {/* Search Bar with live autocomplete */}
          <div className="hidden lg:block relative flex-1 max-w-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search colours, brands, codes..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 max-h-80 overflow-y-auto"
                onMouseLeave={() => setIsSearchOpen(false)}
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                  Matching Shades ({searchResults.length})
                </div>
                {searchResults.slice(0, 5).map((color) => (
                  <button
                    key={color.id}
                    onClick={() => {
                      openProductModal(color);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 text-left transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-lg border border-black/10 shrink-0 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{color.name}</div>
                      <div className="text-[11px] text-slate-500">{color.brand} • {color.code}</div>
                    </div>
                    <span className="text-xs font-semibold text-slate-800">₹{color.pricePer4L}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons & Admin Button */}
          <div className="flex items-center gap-2.5">
            {/* Consultation Free Pill */}
            <button
              onClick={openConsultationModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Free Consultation</span>
            </button>

            {/* Wishlist Button */}
            <a
              href="#colours-section"
              className="relative p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title="Saved Shades"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <a
              href="#brands-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Top Brands
            </a>
            <a
              href="#colours-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Explore Colours
            </a>
            <a
              href="#room-visualizer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Room Colour Visualizer (AI)
            </a>
            <a
              href="#inspiration-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg"
            >
              Inspiration Gallery
            </a>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openCalculatorModal();
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 rounded-lg flex items-center justify-between"
            >
              <span>Room Paint Calculator</span>
              <Calculator className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                openConsultationModal();
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 rounded-lg flex items-center justify-between"
            >
              <span>Book Free Consultation</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
