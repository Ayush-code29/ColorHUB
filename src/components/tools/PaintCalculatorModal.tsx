'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, Calculator, ArrowRight, Paintbrush, Check } from 'lucide-react';

export default function PaintCalculatorModal() {
  const { closeModal, colors, addToCart, setIsCartOpen } = useStore();

  const [length, setLength] = useState(14);
  const [width, setWidth] = useState(12);
  const [height, setHeight] = useState(10);
  const [doors, setDoors] = useState(1);
  const [windows, setWindows] = useState(2);
  const [coats, setCoats] = useState(2);
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id || 'ivory-mist');

  // Calculations
  const perimeter = 2 * (length + width);
  const grossWallArea = perimeter * height;
  const deduction = doors * 21 + windows * 15;
  const netWallArea = Math.max(50, grossWallArea - deduction);
  
  // Standard coverage: ~130 sq ft / liter for 1 coat
  const totalAreaToCover = netWallArea * coats;
  const exactLiters = totalAreaToCover / 130;
  const recommendedLiters = Math.ceil(exactLiters);

  // Recommended pack configuration
  let recommendedPack: '1L' | '4L' | '10L' | '20L' = '4L';
  let packCount = 1;
  if (recommendedLiters <= 1) {
    recommendedPack = '1L';
    packCount = 1;
  } else if (recommendedLiters <= 4) {
    recommendedPack = '4L';
    packCount = 1;
  } else if (recommendedLiters <= 8) {
    recommendedPack = '4L';
    packCount = 2;
  } else if (recommendedLiters <= 10) {
    recommendedPack = '10L';
    packCount = 1;
  } else {
    recommendedPack = '20L';
    packCount = Math.ceil(recommendedLiters / 20);
  }

  const selectedColor = colors.find((c) => c.id === selectedColorId) || colors[0];
  const unitPrice = selectedColor ? selectedColor.pricePer4L : 1250;
  const estimatedCost = Math.round((recommendedLiters / 4) * unitPrice);

  const handleAddEstimateToCart = () => {
    if (!selectedColor) return;
    addToCart({
      colorId: selectedColor.id,
      name: selectedColor.name,
      code: selectedColor.code,
      brand: selectedColor.brand,
      hex: selectedColor.hex,
      packSize: recommendedPack,
      quantity: packCount,
      price: unitPrice,
      roomImage: selectedColor.roomImage,
    });
    closeModal();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 p-6 sm:p-8">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Paint Requirement Estimator
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Room Paint Calculator</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Enter your room dimensions to determine precise paint cans, avoid wastage, and calculate total paint cost.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inputs Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    min={4}
                    max={100}
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    min={4}
                    max={100}
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Height (ft)</label>
                  <input
                    type="number"
                    min={7}
                    max={25}
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Doors Count</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={doors}
                    onChange={(e) => setDoors(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Windows Count</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={windows}
                    onChange={(e) => setWindows(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Number of coats */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Number of Coats</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCoats(num)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        coats === num
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {num} {num === 1 ? 'Coat' : 'Coats'} {num === 2 ? '(Ideal)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Color */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Select Paint Shade</label>
                <select
                  value={selectedColorId}
                  onChange={(e) => setSelectedColorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {colors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code}) - {c.brand} (₹{c.pricePer4L}/4L)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Column */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl border border-black/10 shrink-0 shadow-xs"
                    style={{ backgroundColor: selectedColor?.hex }}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{selectedColor?.name}</h4>
                    <p className="text-xs text-slate-500">{selectedColor?.brand} • {selectedColor?.finish}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Wall Area</span>
                    <p className="text-base font-bold text-slate-800">{netWallArea} sq ft</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-medium">Primer Needed</span>
                    <p className="text-base font-bold text-slate-800">{Math.ceil(netWallArea / 140)} Liters</p>
                  </div>
                </div>

                <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-xl">
                  <span className="text-xs font-bold text-amber-900 block mb-0.5">Recommended Paint</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-amber-600">{recommendedLiters}</span>
                    <span className="text-sm font-semibold text-amber-900">Liters ({packCount} x {recommendedPack} Can)</span>
                  </div>
                  <p className="text-[11px] text-amber-800/80 mt-1">
                    Covers {netWallArea} sq ft for {coats} coats with ~10% buffer for touchups.
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs px-1">
                  <span className="text-slate-600 font-medium">Estimated Paint Cost:</span>
                  <span className="text-lg font-bold text-slate-900">₹{estimatedCost.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleAddEstimateToCart}
                className="mt-4 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Add {packCount}x {recommendedPack} ({selectedColor?.name}) to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
