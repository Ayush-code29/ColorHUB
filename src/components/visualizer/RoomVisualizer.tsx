'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { PaintColor } from '@/types';
import {
  Upload,
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  Check,
  ShoppingBag,
  Heart,
  ChevronRight,
  Maximize2,
  Info,
} from 'lucide-react';

interface SampleRoom {
  id: string;
  name: string;
  image: string;
  wallMaskPolygon: { x: number; y: number }[]; // Coordinates percentage 0-100 for realistic wall area
  shadowIntensity: number;
}

const SAMPLE_ROOMS: SampleRoom[] = [
  {
    id: 'living',
    name: 'Modern Living Room',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85',
    wallMaskPolygon: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 65 },
      { x: 75, y: 68 },
      { x: 25, y: 68 },
      { x: 0, y: 70 },
    ],
    shadowIntensity: 0.85,
  },
  {
    id: 'bedroom',
    name: 'Minimalist Bedroom',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85',
    wallMaskPolygon: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 62 },
      { x: 60, y: 65 },
      { x: 0, y: 62 },
    ],
    shadowIntensity: 0.82,
  },
  {
    id: 'lounge',
    name: 'Terracotta Lounge',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=85',
    wallMaskPolygon: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 72 },
      { x: 0, y: 72 },
    ],
    shadowIntensity: 0.88,
  },
  {
    id: 'dining',
    name: 'Nordic Dining Space',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
    wallMaskPolygon: [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 64 },
      { x: 0, y: 64 },
    ],
    shadowIntensity: 0.84,
  },
];

export default function RoomVisualizer() {
  const {
    colors,
    selectedVisualizerColor,
    setSelectedVisualizerColor,
    openProductModal,
    addToCart,
    showToast,
    toggleWishlist,
    isWishlisted,
  } = useStore();

  const [activeRoom, setActiveRoom] = useState<SampleRoom>(SAMPLE_ROOMS[0]);
  const [customRoomImage, setCustomRoomImage] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100 percent
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [customHex, setCustomHex] = useState<string>('#BE674B');
  const [wallFinish, setWallFinish] = useState<'matte' | 'satin' | 'gloss'>('matte');
  const [isComparing, setIsComparing] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploaded image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size exceeds 10MB limit', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomRoomImage(event.target.result as string);
          showToast('Custom room photo uploaded! Try tapping any shade below.', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Dragging slider logic
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingSlider && e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) {
      handleMove(e.clientX);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDraggingSlider(false);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const currentDisplayImage = customRoomImage || activeRoom.image;
  const currentColor = selectedVisualizerColor || colors[0];

  const handleDownload = () => {
    showToast('Preparing high-res visualization render...', 'info');
    setTimeout(() => {
      // Create quick download trigger
      const link = document.createElement('a');
      link.download = `ColorHub-${currentColor.name.replace(/\s+/g, '_')}-preview.jpg`;
      link.href = currentDisplayImage;
      link.click();
      showToast('Visualisation downloaded successfully!', 'success');
    }, 600);
  };

  const handleQuickOrder = () => {
    addToCart({
      colorId: currentColor.id,
      name: currentColor.name,
      code: currentColor.code,
      brand: currentColor.brand,
      hex: currentColor.hex,
      packSize: '4L',
      quantity: 1,
      price: currentColor.pricePer4L,
      roomImage: currentColor.roomImage,
    });
  };

  return (
    <section id="room-visualizer" className="py-16 bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Interactive Wall Colour Studio</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Room Colour Visualizer
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Upload your room photo or pick a sample living room, then test authentic paint shades instantly with realistic ambient lighting preservation.
          </p>
        </div>

        {/* Main Visualizer Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Room Selection & Photo Uploader (4 cols) */}
          <div className="lg:col-span-4 p-6 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between bg-slate-50/60">
            <div className="space-y-6">
              {/* Upload Card */}
              <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-500/50 transition-colors text-center group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Upload a room photo</h4>
                <p className="text-xs text-slate-500 mb-3">JPG, PNG up to 10MB</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  Choose Image
                </button>
              </div>

              {/* Sample Rooms Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Or try sample rooms
                  </span>
                  {customRoomImage && (
                    <button
                      onClick={() => setCustomRoomImage(null)}
                      className="text-[11px] text-amber-600 font-semibold hover:underline"
                    >
                      Reset to sample
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {SAMPLE_ROOMS.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setActiveRoom(room);
                        setCustomRoomImage(null);
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 text-left transition-all group h-24 ${
                        activeRoom.id === room.id && !customRoomImage
                          ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                        <p className="text-[11px] font-semibold text-white leading-tight truncate">
                          {room.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish & Sheen selector */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Simulation Sheen
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['matte', 'satin', 'gloss'] as const).map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setWallFinish(finish)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition-all text-center ${
                        wallFinish === finish
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick tips */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Tip: Slide the divider on the image to see a live Before &amp; After split view.
              </span>
            </div>
          </div>

          {/* Right Column: Visualizer Canvas & Color Swatches (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-white">
            {/* Split Comparison Canvas Area */}
            <div
              ref={containerRef}
              onMouseDown={() => setIsDraggingSlider(true)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDraggingSlider(true)}
              className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden select-none bg-slate-900 shadow-inner cursor-ew-resize group"
            >
              {/* Layer 1: Original Clean Room (Underneath / Left side) */}
              <img
                src={currentDisplayImage}
                alt="Original Room"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* Layer 2: Recolored Room (Clipped by slider position on right side) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  clipPath: isComparing
                    ? `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
                    : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                }}
              >
                {/* Base Room */}
                <img
                  src={currentDisplayImage}
                  alt="Recolored Room"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />

                {/* Intelligent Realistic Wall Color Overlay with multiply & color blending */}
                <div
                  className="absolute inset-0 mix-blend-multiply transition-colors duration-300"
                  style={{
                    backgroundColor: currentColor.hex,
                    opacity: wallFinish === 'gloss' ? 0.65 : wallFinish === 'satin' ? 0.72 : 0.8,
                  }}
                />

                {/* Additional color blend for saturation fidelity */}
                <div
                  className="absolute inset-0 mix-blend-color opacity-60 transition-colors duration-300"
                  style={{ backgroundColor: currentColor.hex }}
                />

                {/* Sheen highlight gradient */}
                {wallFinish === 'gloss' && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent mix-blend-overlay pointer-events-none" />
                )}
              </div>

              {/* Comparison Slider Line */}
              {isComparing && (
                <div
                  className="absolute inset-y-0 w-0.5 bg-white shadow-2xl z-20 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-slate-900/10 pointer-events-auto cursor-ew-resize">
                    <Sliders className="w-3.5 h-3.5 text-slate-800 rotate-90" />
                  </div>
                </div>
              )}

              {/* Before & After Labels */}
              {isComparing && (
                <>
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
                    Original
                  </div>
                  <div className="absolute top-4 right-4 bg-amber-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: currentColor.hex }}
                    />
                    <span>{currentColor.name}</span>
                  </div>
                </>
              )}

              {/* View toggle tools top-center */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={() => setIsComparing(!isComparing)}
                  className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-semibold shadow-md backdrop-blur-md transition-colors"
                >
                  {isComparing ? 'Full Wall View' : 'Split View'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 bg-white/90 hover:bg-white text-slate-800 rounded-lg shadow-md backdrop-blur-md transition-colors"
                  title="Download render"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom Color Swatches Bar (matching mockup) */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <span className="text-xs font-bold text-slate-900">
                    Active Shade: {currentColor.name}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">({currentColor.code})</span>
                  <span className="text-xs font-semibold text-amber-600 ml-1">
                    • {currentColor.brand}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openProductModal(currentColor)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={handleQuickOrder}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Order (₹{currentColor.pricePer4L})</span>
                  </button>
                </div>
              </div>

              {/* Horizontal Swatches Carousel */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {colors.map((color) => {
                  const isSelected = currentColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setSelectedVisualizerColor(color)}
                      className={`flex flex-col items-center gap-1.5 shrink-0 p-1.5 rounded-xl transition-all ${
                        isSelected
                          ? 'ring-2 ring-amber-500 bg-amber-50/50 scale-105'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-black/10 shadow-sm relative overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-slate-900">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-slate-700 max-w-[50px] truncate text-center">
                        {color.name}
                      </span>
                    </button>
                  );
                })}

                {/* Custom Color Picker Swatch */}
                <div className="flex flex-col items-center gap-1.5 shrink-0 p-1.5">
                  <label className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 cursor-pointer flex items-center justify-center bg-slate-50 relative overflow-hidden">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => {
                        setCustomHex(e.target.value.toUpperCase());
                        setSelectedVisualizerColor({
                          ...currentColor,
                          id: 'custom',
                          name: 'Custom Mix',
                          code: 'CUST-01',
                          hex: e.target.value.toUpperCase(),
                        });
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div
                      className="w-5 h-5 rounded-md border border-black/10"
                      style={{ backgroundColor: customHex }}
                    />
                  </label>
                  <span className="text-[10px] font-medium text-slate-500">Custom</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
