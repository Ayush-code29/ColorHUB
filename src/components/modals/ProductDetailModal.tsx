'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PaintColor } from '@/types';
import {
  X,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Check,
  Eye,
  Star,
} from 'lucide-react';

interface Props {
  color: PaintColor;
}

export default function ProductDetailModal({ color }: Props) {
  const {
    closeModal,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedVisualizerColor,
    setIsCartOpen,
    openCheckoutModal,
  } = useStore();

  const [packSize, setPackSize] = useState<'1L' | '4L' | '10L' | '20L'>('4L');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'coverage'>('details');

  const wishlisted = isWishlisted(color.id);

  // Price calculations based on pack size
  const packMultiplier: Record<string, number> = {
    '1L': 0.32,
    '4L': 1,
    '10L': 2.36,
    '20L': 4.48,
  };

  const currentPrice = Math.round(color.pricePer4L * packMultiplier[packSize]);

  const handleAddToCart = () => {
    addToCart({
      colorId: color.id,
      name: color.name,
      code: color.code,
      brand: color.brand,
      hex: color.hex,
      packSize,
      quantity,
      price: currentPrice,
      roomImage: color.roomImage,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    closeModal();
    setIsCartOpen(true);
  };

  const handleTestInVisualizer = () => {
    setSelectedVisualizerColor(color);
    closeModal();
    // Scroll to visualizer
    const el = document.getElementById('room-visualizer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 bg-white/80 hover:bg-white rounded-full backdrop-blur-md shadow-sm transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Visual Swatch & Room Preview */}
          <div className="md:w-1/2 bg-slate-50 relative flex flex-col">
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
              <img
                src={color.roomImage}
                alt={`${color.name} room visualization`}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1.5">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                  style={{ backgroundColor: color.hex }}
                />
                <span>Real Room Preview</span>
              </div>
            </div>

            {/* Color Swatch Card underneath */}
            <div className="p-6 bg-white border-t border-slate-100 flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border border-black/10 shadow-inner shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                    Hex Code
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-800">{color.hex}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Finish: <span className="font-medium text-slate-700">{color.finish}</span> • Category: <span className="font-medium text-slate-700">{color.category}</span>
                  </div>
                </div>
              </div>

              {/* Try in Visualizer Quick Pill */}
              <button
                onClick={handleTestInVisualizer}
                className="mt-4 w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Test this Shade in Room Visualizer</span>
              </button>
            </div>
          </div>

          {/* Right Column: Shade Details, Pricing, & Actions */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Breadcrumbs */}
              <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mb-2">
                <span>Home</span>
                <span>/</span>
                <span>{color.brand}</span>
                <span>/</span>
                <span className="text-slate-800 font-semibold">{color.name}</span>
              </div>

              {/* Title & Favorite */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">{color.name}</h2>
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 font-mono font-medium rounded">
                      {color.code}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-600 mt-0.5">{color.brand}</p>
                </div>

                <button
                  onClick={() => toggleWishlist(color.id)}
                  className={`p-2.5 rounded-full border transition-all ${
                    wishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-500'
                      : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300'
                  }`}
                  title={wishlisted ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-700">{color.rating || 4.8}</span>
                <span className="text-xs text-slate-400">({color.reviewsCount || 84} verified reviews)</span>
              </div>

              {/* Price display */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500">
                  ({packSize}) inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {color.description}
              </p>

              {/* Pack Size Pills */}
              <div className="mt-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-800">Select Container Size</span>
                  <span className="text-[11px] text-slate-400">Recommended for living room: 4L or 10L</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {(['1L', '4L', '10L', '20L'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setPackSize(size)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                        packSize === size
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div className="mt-4 flex items-center gap-4">
                <span className="text-xs font-semibold text-slate-800">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-xl px-2 py-1 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-0.5 text-slate-500 hover:text-slate-800 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-0.5 text-slate-500 hover:text-slate-800 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Total: <strong className="text-slate-900">₹{(currentPrice * quantity).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 border-2 border-slate-900 text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 transition-all hover:scale-[1.01]"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Easy Exchange</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
