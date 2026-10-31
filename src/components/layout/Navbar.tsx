
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingBag,
  Heart,
  Calculator,
  Sparkles,
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

// ==========================================
// BRAND CONFIGURATION — CHANGE THESE 2 VALUES
// ==========================================
const BRAND_NAME = 'AASHIRVAD PAINT';
const LOGO_PATH = '/logo.jpeg';
const BRAND_TAGLINE = 'Luxury paints & decor';

export default function Navbar() {
  const {
    colors,
    cartItemsCount,
    wishlist,
    setIsCartOpen,
    openCalculatorModal,
    openProductModal,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchResults = searchQuery.trim()
    ? colors
        .filter((color) => {
          const query = searchQuery.trim().toLowerCase();

          return (
            color.name.toLowerCase().includes(query) ||
            color.code.toLowerCase().includes(query) ||
            color.brand.toLowerCase().includes(query) ||
            color.category.toLowerCase().includes(query)
          );
        })
        .slice(0, 6)
    : [];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass =
    'inline-flex h-11 items-center whitespace-nowrap border-b-2 border-transparent px-1 text-[13px] font-medium text-slate-600 transition-colors hover:border-amber-600 hover:text-slate-950';

  const openSearchResult = (color: (typeof colors)[number]) => {
    openProductModal(color);
    setSearchQuery('');
    setIsSearchOpen(false);
    closeMobileMenu();
  };

  const scrollToColours = () => {
    document.getElementById('colours-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const renderSearchBox = (mobile = false) => (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();

          if (searchResults.length > 0) {
            openSearchResult(searchResults[0]);
          } else if (searchQuery.trim()) {
            scrollToColours();
            setIsSearchOpen(false);
          }
        }}
        className={`group flex h-11 items-center gap-3 rounded-xl border bg-white px-3.5 transition-all focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 ${
          isSearchOpen && searchQuery.trim()
            ? 'border-amber-400'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <Search className="h-[18px] w-[18px] shrink-0 text-slate-400 transition-colors group-focus-within:text-amber-700" />

        <input
          type="search"
          value={searchQuery}
          onFocus={() => setIsSearchOpen(true)}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setIsSearchOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setIsSearchOpen(false);
          }}
          placeholder="Search colours, brands or shade codes"
          aria-label="Search colours, brands or shade codes"
          aria-expanded={isSearchOpen && Boolean(searchQuery.trim())}
          className="min-w-0 flex-1 bg-transparent text-[13px] font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(true);
            }}
            aria-label="Clear search"
            className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          !mobile && (
            <span className="hidden shrink-0 rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 xl:inline">
              Search
            </span>
          )
        )}
      </form>

      {isSearchOpen && searchQuery.trim() && (
        <>
          <button
            type="button"
            aria-label="Close search suggestions"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsSearchOpen(false)}
          />

          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                {searchResults.length > 0
                  ? 'Matching shades'
                  : 'No exact matches'}
              </span>

              {searchResults.length > 0 && (
                <span className="text-xs tabular-nums text-slate-400">
                  {searchResults.length}{' '}
                  {searchResults.length === 1 ? 'result' : 'results'}
                </span>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto p-2">
                {searchResults.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => openSearchResult(color)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                  >
                    <span
                      className="h-10 w-10 shrink-0 rounded-lg border border-black/10 shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      aria-hidden="true"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {color.name}
                      </span>

                      <span className="mt-0.5 block truncate text-xs text-slate-500">
                        {color.brand}
                        <span className="px-1 text-slate-300">/</span>
                        {color.code}
                      </span>
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-slate-800">
                      ₹{color.pricePer4L}
                    </span>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-5">
                <p className="text-sm text-slate-600">
                  Try a shade name, brand name or colour code.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    scrollToColours();
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-amber-800 hover:text-amber-950"
                >
                  Explore all colours
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 xl:px-10">
        <div className="grid min-h-[76px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-3 lg:grid-cols-[220px_minmax(240px,1fr)_auto] lg:gap-x-8 lg:py-0">
          {/* BRAND LOGO + NAME */}
          

<Link
  href="/"
  aria-label="Aashirvad Paint home"
  onClick={closeMobileMenu}
  className="group flex w-fit min-w-0 items-center gap-3.5"
>
  {/* Brand logo */}
  <span className="relative h-[54px] w-[54px] shrink-0 overflow-hidden rounded-[13px] bg-white">
    <Image
      src={LOGO_PATH}
      alt="Aashirvad Paint logo"
      width={54}
      height={54}
      priority
      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
    />
  </span>

  {/* Premium wordmark */}
  <span className="flex min-w-0 flex-col justify-center">
    <span className="font-sans text-[22px] font-bold leading-[1.05] tracking-[-0.055em] text-[#17202C] transition-colors duration-200 group-hover:text-[#9A7135] sm:text-[25px]">
      Aashirvad Paint
    </span>

    <span className="mt-2 flex items-center gap-2">
      <span className="h-px w-4 shrink-0 bg-[#B58A45]" />
      <span className="whitespace-nowrap text-[9px] font-medium uppercase leading-none tracking-[0.16em] text-[#737780] sm:text-[10px]">
        Luxury Paints &amp; Decor
      </span>
    </span>
  </span>
</Link>



          {/* DESKTOP SEARCH */}
          <div className="hidden min-w-0 lg:block">
            {renderSearchBox()}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <Link
              href="#colours-section"
              aria-label={`Saved shades${
                wishlist.length ? `, ${wishlist.length} saved` : ''
              }`}
              title="Saved shades"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.8} />

              {wishlist.length > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {wishlist.length > 9 ? '9+' : wishlist.length}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping bag${
                cartItemsCount ? `, ${cartItemsCount} items` : ''
              }`}
              title="Shopping bag"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} />

              {cartItemsCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-amber-700 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setIsMobileMenuOpen((current) => !current)
              }
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden min-w-0 items-center justify-between gap-8 lg:flex">
          <nav
            aria-label="Main navigation"
            className="flex min-w-0 items-center gap-6"
          >
            <Link href="/" className={navLinkClass}>
              Home
            </Link>

            <a href="#brands-section" className={navLinkClass}>
              Brands
            </a>

            <a href="#colours-section" className={navLinkClass}>
              Explore colours
            </a>

            <a href="#inspiration-section" className={navLinkClass}>
              Inspiration gallery
            </a>

            <a href="#room-visualizer" className={navLinkClass}>
              Room visualizer
            </a>

            <button
              type="button"
              onClick={openCalculatorModal}
              className={navLinkClass}
            >
              Paint calculator
            </button>

            <a href="#offers-section" className={navLinkClass}>
              Offers
            </a>

            <a
              href="#shade-cards-section"
              className={`${navLinkClass} font-semibold text-amber-700 hover:border-amber-700 hover:text-amber-800`}
            >
              Shade Cards
            </a>
          </nav>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 shadow-lg sm:px-6 lg:hidden">
          <div className="mb-4">
            {renderSearchBox(true)}
          </div>

          <nav aria-label="Mobile navigation" className="space-y-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Home
            </Link>

            <a
              href="#brands-section"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Brands
            </a>

            <a
              href="#colours-section"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Explore colours
            </a>

            <a
              href="#inspiration-section"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Inspiration gallery
            </a>

            <a
              href="#room-visualizer"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Room visualizer
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800">
                AI
              </span>
            </a>

            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                openCalculatorModal();
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Paint calculator
              <Calculator className="h-4 w-4 text-slate-400" />
            </button>

            <a
              href="#offers-section"
              onClick={closeMobileMenu}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              Offers
            </a>

            <a
              href="#shade-cards-section"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50"
            >
              <span>Shade Cards (PDF)</span>
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">
                5 PDFs
              </span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
