'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PaintColor, PaintBrand, PaintCategory, PaintFinish } from '@/types';
import { X, ArrowLeft, Upload, Check, Eye } from 'lucide-react';

interface Props {
  colorToEdit?: PaintColor;
}

export default function AdminAddColorModal({ colorToEdit }: Props) {
  const { closeModal, addColor, updateColor } = useStore();

  const [formData, setFormData] = useState({
    name: colorToEdit?.name || '',
    brand: (colorToEdit?.brand || 'Asian Paints') as PaintBrand,
    code: colorToEdit?.code || 'AP-105',
    category: (colorToEdit?.category || 'Interior') as PaintCategory,
    finish: (colorToEdit?.finish || 'Matte') as PaintFinish,
    hex: colorToEdit?.hex || '#EAE3D2',
    pricePer4L: colorToEdit?.pricePer4L || 1250,
    roomImage:
      colorToEdit?.roomImage ||
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    description:
      colorToEdit?.description ||
      'A soft and elegant shade that brings warmth and brightness to your space.',
    isActive: colorToEdit?.isActive ?? true,
    wallMaskType: (colorToEdit?.wallMaskType || 'living') as any,
  });

  const presetImages = [
    {
      label: 'Living Room',
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Bedroom',
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Kitchen',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    },
    {
      label: 'Warm Lounge',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (colorToEdit) {
      updateColor(colorToEdit.id, formData);
    } else {
      addColor(formData);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={closeModal}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {colorToEdit ? 'Edit Colour' : 'Add / Edit Colour'}
                </h2>
                <p className="text-xs text-slate-500">
                  Manage shade information, pricing, palette swatches, and room photography.
                </p>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form & Preview Columns */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Fields (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Colour Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ivory Mist"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value as PaintBrand })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option>Asian Paints</option>
                    <option>Berger</option>
                    <option>Dulux</option>
                    <option>Nerolac</option>
                    <option>JSW</option>
                    <option>Indigo</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Colour Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AP-101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PaintCategory })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option>Interior</option>
                    <option>Exterior</option>
                    <option>Wall</option>
                    <option>Wood</option>
                    <option>Metal</option>
                    <option>Texture</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Finish</label>
                  <select
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value as PaintFinish })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option>Matte</option>
                    <option>Satin</option>
                    <option>Gloss</option>
                    <option>Texture</option>
                    <option>Eggshell</option>
                  </select>
                </div>
              </div>

              {/* Price & Colour Swatch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹ per 4 Liters)</label>
                  <input
                    type="number"
                    required
                    min={200}
                    value={formData.pricePer4L}
                    onChange={(e) => setFormData({ ...formData, pricePer4L: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Colour Preview & Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.hex}
                      onChange={(e) => setFormData({ ...formData, hex: e.target.value.toUpperCase() })}
                      className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      required
                      placeholder="#F4EFE6"
                      value={formData.hex}
                      onChange={(e) => setFormData({ ...formData, hex: e.target.value.toUpperCase() })}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Images selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Room Preview Photography
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {presetImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData({ ...formData, roomImage: img.url })}
                      className={`relative rounded-xl overflow-hidden border-2 h-16 transition-all ${
                        formData.roomImage === img.url
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-0.5 text-center font-medium">
                        {img.label}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  placeholder="Or enter custom image URL (Unsplash, etc.)"
                  value={formData.roomImage}
                  onChange={(e) => setFormData({ ...formData, roomImage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detailed aesthetic description of the shade..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-800">Catalogue Status</span>
                  <p className="text-[11px] text-slate-400">Available to customers in online store</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>

            {/* Live Preview Column (matching bottom-right mockup) */}
            <div className="border border-slate-100 bg-slate-50/80 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Preview
                  </span>
                  <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {formData.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                {/* Preview Card */}
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  {/* Photo with subtle overlay simulation */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={formData.roomImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute inset-0 mix-blend-multiply opacity-30 pointer-events-none"
                      style={{ backgroundColor: formData.hex }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {formData.name || 'Untitled Shade'}
                        </h4>
                        <p className="text-xs text-amber-600 font-semibold">{formData.brand}</p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-xl border border-black/10 shadow-xs"
                        style={{ backgroundColor: formData.hex }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-100">
                      <span className="font-mono text-slate-500">{formData.code}</span>
                      <span className="font-bold text-slate-900">₹{formData.pricePer4L.toLocaleString('en-IN')} (4L)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-950/10"
                >
                  Save Shade
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
