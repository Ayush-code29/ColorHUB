'use client';

import React from 'react';
import Link from 'next/link';
import { Palette, Phone, Mail, MapPin } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { openConsultationModal, openCalculatorModal } = useStore();

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Color<span className="text-amber-500">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              India's premier architectural paint studio and authorized distributor for Asian Paints, Berger, Dulux, Nerolac, JSW and Indigo paints. Transform your home with precision tinting and professional finish warranties.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+91 1800 212 9900 (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>care@colorhubpaints.in</span>
              </div>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Top Brands
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">Asian Paints Royale</a></li>
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">Berger Silk Glamor</a></li>
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">Dulux Velvet Touch</a></li>
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">Nerolac Beauty Gold</a></li>
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">JSW Halo Elegance</a></li>
              <li><a href="#brands-section" className="hover:text-amber-400 transition-colors">Indigo Metallic Finish</a></li>
            </ul>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#room-visualizer" className="hover:text-amber-400 transition-colors">Room Colour Visualizer</a></li>
              <li><button onClick={openCalculatorModal} className="hover:text-amber-400 transition-colors">Paint Quantity Calculator</button></li>
              <li><button onClick={openConsultationModal} className="hover:text-amber-400 transition-colors">Free Home Consultation</button></li>
              <li><a href="#inspiration-section" className="hover:text-amber-400 transition-colors">Room Palette Ideas</a></li>
              <li><Link href="/admin" className="text-amber-400 font-semibold hover:underline">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Finishes & Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Paint Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#colours-section" className="hover:text-amber-400 transition-colors">Interior Luxury Emulsion</a></li>
              <li><a href="#colours-section" className="hover:text-amber-400 transition-colors">Exterior Weatherproof</a></li>
              <li><a href="#colours-section" className="hover:text-amber-400 transition-colors">Wood &amp; Metal Enamels</a></li>
              <li><a href="#colours-section" className="hover:text-amber-400 transition-colors">Designer Wall Textures</a></li>
              <li><a href="#colours-section" className="hover:text-amber-400 transition-colors">Waterproofing Primers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ColorHub Paints Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Warranty Details</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
