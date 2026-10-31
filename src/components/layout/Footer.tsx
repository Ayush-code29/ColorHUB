
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const BRAND_NAME = 'Aashirvad Paint';
const LOGO_PATH = '/logo.jpeg';
const BRAND_TAGLINE = 'Luxury Paints & Decor';

export default function Footer() {
  const { openConsultationModal, openCalculatorModal } = useStore();

  const footerLinkClass =
    'text-[13px] text-slate-400 transition-colors duration-200 hover:text-amber-400';

  const footerHeadingClass =
    'mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white';

  return (
    <footer className="border-t border-white/[0.08] bg-[#111820] text-white">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10 lg:py-16">
          {/* Brand */}
          <div className="space-y-5 sm:col-span-2">
            <Link
              href="/"
              aria-label={`${BRAND_NAME} home`}
              className="group inline-flex items-center gap-3.5"
            >
              <span className="relative h-[58px] w-[58px] shrink-0 overflow-hidden rounded-[13px] bg-white">
                <Image
                  src={LOGO_PATH}
                  alt={`${BRAND_NAME} logo`}
                  width={58}
                  height={58}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>

              <span className="flex flex-col justify-center">
                <span className="text-[23px] font-bold leading-tight tracking-[-0.045em] text-white sm:text-[25px]">
                  Aashirvad <span className="text-[#D6AD68]">Paint</span>
                </span>

                <span className="mt-2 flex items-center gap-2">
                  <span className="h-px w-4 bg-[#D6AD68]" />
                  <span className="text-[9px] font-medium uppercase tracking-[0.17em] text-slate-400 sm:text-[10px]">
                    {BRAND_TAGLINE}
                  </span>
                </span>
              </span>
            </Link>

            <p className="max-w-md text-[13px] leading-7 text-slate-400">
              Discover beautiful colours and quality paints for every space.
              Explore shades, find inspiration and choose the perfect finish
              to bring your home to life.
            </p>

            <div className="space-y-3 pt-1">
              <a
                href="tel:+9118002129900"
                className="group flex w-fit items-center gap-3 text-[13px] text-slate-400 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-[#D6AD68]" />
                <span>+91 1800 212 9900</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>

              <a
                href="mailto:care@colorhubpaints.in"
                className="group flex w-fit items-center gap-3 text-[13px] text-slate-400 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-[#D6AD68]" />
                <span>care@colorhubpaints.in</span>
                <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className={footerHeadingClass}>Top Brands</h4>
            <ul className="space-y-3">
              <li>
                <a href="#brands-section" className={footerLinkClass}>
                  Asian Paints Royale
                </a>
              </li>
              <li>
                <a href="#brands-section" className={footerLinkClass}>
                  Birla Opus
                </a>
              </li>
              
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <h4 className={footerHeadingClass}>Explore Tools</h4>
            <ul className="space-y-3">
              <li>
                <a href="#room-visualizer" className={footerLinkClass}>
                  Room Colour Visualizer
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openCalculatorModal}
                  className={footerLinkClass}
                >
                  Paint Quantity Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={openConsultationModal}
                  className={footerLinkClass}
                >
                  Free Home Consultation
                </button>
              </li>
              <li>
                <a href="#inspiration-section" className={footerLinkClass}>
                  Room Palette Ideas
                </a>
              </li>
            </ul>
          </div>

          {/* Paint Categories */}
          <div>
            <h4 className={footerHeadingClass}>Paint Categories</h4>
            <ul className="space-y-3">
              <li>
                <a href="#colours-section" className={footerLinkClass}>
                  Interior Emulsion
                </a>
              </li>
              <li>
                <a href="#colours-section" className={footerLinkClass}>
                  Exterior Paints
                </a>
              </li>
              <li>
                <a href="#colours-section" className={footerLinkClass}>
                  Wood &amp; Metal Enamel
                </a>
              </li>
              <li>
                <a href="#colours-section" className={footerLinkClass}>
                  Distemper
                </a>
              </li>
              <li>
                <a href="#colours-section" className={footerLinkClass}>
                  Acrylic &amp; Cement Paint
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 border-t border-white/[0.08] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-[11px] leading-5 text-slate-500 sm:text-left">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a
              href="/privacy-policy"
              className="text-[11px] text-slate-500 transition-colors hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="text-[11px] text-slate-500 transition-colors hover:text-white"
            >
              Terms of Service
            </a>

            <a
              href="#colours-section"
              className="text-[11px] text-slate-500 transition-colors hover:text-white"
            >
              Explore Colours
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
