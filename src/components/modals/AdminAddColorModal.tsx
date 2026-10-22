
'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { PaintColor, PaintFinish } from '@/types';
import { X, ArrowLeft } from 'lucide-react';

interface Props {
  colorToEdit?: PaintColor;
}

const DEFAULT_ROOM_IMAGE =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';

const PRESET_IMAGES = [
  {
    label: 'Living Room',
    url: DEFAULT_ROOM_IMAGE,
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

const PAINT_CATEGORIES = [
  "Emulsion",
  "Enamel",
  "Distemper",
  "Acrylic",
  "Cement",
];

type BrandOption = {
  id: string;
  name: string;
  tagline?: string;
};

export default function AdminAddColorModal({
  colorToEdit,
}: Props) {
  const {
    closeModal,
    addColor,
    updateColor,
    brands,
    showToast,
  } = useStore();

  const availableBrands = brands as BrandOption[];

  const existingBrandId = (() => {
    const color = colorToEdit as any;

    if (!color) return '';

    if (color.brandId) {
      return String(
        typeof color.brandId === 'object'
          ? color.brandId._id ?? color.brandId.id ?? ''
          : color.brandId
      );
    }

    if (color.brand && typeof color.brand === 'object') {
      return String(color.brand._id ?? color.brand.id ?? '');
    }

    return '';
  })();

  const [formData, setFormData] = useState({
    name: colorToEdit?.name ?? '',
    brand: existingBrandId,
    code: colorToEdit?.code ?? '',
    category: String(colorToEdit?.category ?? 'Emulsion'),
    finish: (colorToEdit?.finish ?? 'Matte') as PaintFinish,
    hex: colorToEdit?.hex ?? '#EAE3D2',
    pricePer4L: colorToEdit?.pricePer4L ?? 1250,
    roomImage: colorToEdit?.roomImage ?? DEFAULT_ROOM_IMAGE,
    description:
      colorToEdit?.description ??
      'A soft and elegant shade that brings warmth and brightness to your space.',
    isActive: colorToEdit?.isActive ?? true,
    wallMaskType: String(
      (colorToEdit as any)?.wallMaskType ?? 'living'
    ),
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (availableBrands.length === 0) return;

    setFormData((current) => {
      if (
        current.brand &&
        availableBrands.some(
          (brand) => String(brand.id) === current.brand
        )
      ) {
        return current;
      }

      const preferredBrand =
        availableBrands.find(
          (brand) => brand.name === 'Asian Paints'
        ) ??
        availableBrands.find(
          (brand) => brand.name === 'Birla Opus'
        ) ??
        availableBrands[0];

      return {
        ...current,
        brand: String(preferredBrand.id),
      };
    });
  }, [brands]);

  const selectedBrand = availableBrands.find(
    (brand) => String(brand.id) === String(formData.brand)
  );

  const updateField = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    const name = formData.name.trim();
    const code = formData.code.trim();
    const description = formData.description.trim();

    if (!name || !code || !description) {
      showToast(
        'Please complete all required fields.',
        'error'
      );
      return;
    }

    if (!formData.brand || !selectedBrand) {
      showToast(
        'Please select a valid brand.',
        'error'
      );
      return;
    }

    if (!/^#[0-9A-Fa-f]{6}$/.test(formData.hex)) {
      showToast(
        'Please enter a valid HEX colour, such as #EAE3D2.',
        'error'
      );
      return;
    }

    if (
      !Number.isFinite(formData.pricePer4L) ||
      formData.pricePer4L <= 0
    ) {
      showToast(
        'Please enter a valid price.',
        'error'
      );
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        // The backend should store this as a Brand reference.
        brand: formData.brand,
        category: formData.category,
        code,
        finish: formData.finish,
        hex: formData.hex.toUpperCase(),
        pricePer4L: Number(formData.pricePer4L),
        roomImage: formData.roomImage.trim(),
        description,
        isActive: formData.isActive,
        wallMaskType: formData.wallMaskType,
      };

      const success = colorToEdit
        ? await updateColor(
            colorToEdit.id,
            payload as unknown as Partial<PaintColor>
          )
        : await addColor(
            payload as unknown as Omit<PaintColor, 'id'>
          );

      if (success) {
        closeModal();
      }
    } catch (error) {
      console.error('Failed to save paint colour:', error);

      showToast(
        'Unable to save the colour. Please try again.',
        'error'
      );
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-medium outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20';

  const labelClass =
    'mb-1 block text-xs font-semibold text-slate-700';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        aria-label="Close colour form"
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
        <div className="relative my-4 w-full max-w-4xl rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                aria-label="Go back"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {colorToEdit ? 'Edit Colour' : 'Add New Colour'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage brand, paint category, pricing and room photography.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            <div className="space-y-4 lg:col-span-2">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="colour-name">
                    Colour Name *
                  </label>
                  <input
                    id="colour-name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="e.g. Ivory Mist"
                    value={formData.name}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="colour-brand">
                    Brand *
                  </label>
                  <select
                    id="colour-brand"
                    required
                    value={formData.brand}
                    onChange={(event) =>
                      updateField('brand', event.target.value)
                    }
                    className={inputClass}
                    disabled={availableBrands.length === 0}
                  >
                    <option value="">Select a brand</option>
                    {availableBrands.map((brand) => (
                      <option
                        key={brand.id}
                        value={String(brand.id)}
                      >
                        {brand.name}
                      </option>
                    ))}
                  </select>

                  {availableBrands.length === 0 && (
                    <p className="mt-1 text-[11px] text-rose-600">
                      No brands found. Check the Brand Management page.
                    </p>
                  )}

                  {selectedBrand?.tagline && (
                    <p className="mt-1 text-[11px] text-slate-500">
                      {selectedBrand.tagline}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass} htmlFor="colour-code">
                    Colour Code *
                  </label>
                  <input
                    id="colour-code"
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g. AP-101"
                    value={formData.code}
                    onChange={(event) =>
                      updateField('code', event.target.value)
                    }
                    className={`${inputClass} font-mono`}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="colour-category">
                    Category *
                  </label>
                  <select
                    id="colour-category"
                    required
                    value={formData.category}
                    onChange={(event) =>
                      updateField('category', event.target.value)
                    }
                    className={inputClass}
                  >
                    {PAINT_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="colour-finish">
                    Finish *
                  </label>
                  <select
                    id="colour-finish"
                    required
                    value={formData.finish}
                    onChange={(event) =>
                      updateField(
                        'finish',
                        event.target.value as PaintFinish
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Matte">Matte</option>
                    <option value="Satin">Satin</option>
                    <option value="Gloss">Gloss</option>
                    <option value="Texture">Texture</option>
                    <option value="Eggshell">Eggshell</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="colour-price">
                    Price per 4 Litres (₹) *
                  </label>
                  <input
                    id="colour-price"
                    type="number"
                    required
                    min={1}
                    step="0.01"
                    value={formData.pricePer4L}
                    onChange={(event) =>
                      updateField(
                        'pricePer4L',
                        Number(event.target.value)
                      )
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="colour-hex">
                    Colour Preview & HEX *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      aria-label="Choose colour"
                      type="color"
                      value={formData.hex}
                      onChange={(event) =>
                        updateField(
                          'hex',
                          event.target.value.toUpperCase()
                        )
                      }
                      className="h-10 w-10 cursor-pointer rounded-xl border border-slate-200 bg-white p-0.5"
                    />
                    <input
                      id="colour-hex"
                      type="text"
                      required
                      pattern="^#[0-9A-Fa-f]{6}$"
                      maxLength={7}
                      placeholder="#F4EFE6"
                      value={formData.hex}
                      onChange={(event) =>
                        updateField(
                          'hex',
                          event.target.value.toUpperCase()
                        )
                      }
                      className={`${inputClass} font-mono font-semibold`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Room Preview Photography
                </label>

                <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PRESET_IMAGES.map((image) => (
                    <button
                      key={image.label}
                      type="button"
                      onClick={() =>
                        updateField('roomImage', image.url)
                      }
                      aria-pressed={formData.roomImage === image.url}
                      className={`relative h-16 overflow-hidden rounded-xl border-2 transition ${
                        formData.roomImage === image.url
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.label}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[9px] font-medium text-white">
                        {image.label}
                      </span>
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  aria-label="Custom room image URL"
                  placeholder="Or enter a custom image URL"
                  value={formData.roomImage}
                  onChange={(event) =>
                    updateField('roomImage', event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="colour-description">
                  Description *
                </label>
                <textarea
                  id="colour-description"
                  rows={3}
                  required
                  maxLength={1000}
                  placeholder="Describe the shade and its aesthetic..."
                  value={formData.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    Catalogue Status
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Make this colour available to customers
                  </p>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(event) =>
                      updateField('isActive', event.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <span className="h-6 w-11 rounded-full bg-slate-200 transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/30" />
                </label>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Preview
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                      formData.isActive
                        ? 'border-emerald-100 bg-emerald-50 text-emerald-600'
                        : 'border-slate-200 bg-slate-100 text-slate-500'
                    }`}
                  >
                    {formData.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    {formData.roomImage ? (
                      <img
                        src={formData.roomImage}
                        alt={`${formData.name || 'Colour'} room preview`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">
                        No room image
                      </div>
                    )}

                    <div
                      className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-30"
                      style={{ backgroundColor: formData.hex }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="truncate text-base font-bold text-slate-900">
                          {formData.name || 'Untitled Shade'}
                        </h4>
                        <p className="mt-1 truncate text-xs font-semibold text-amber-600">
                          {selectedBrand?.name || 'Select a brand'}
                        </p>
                        {selectedBrand?.tagline && (
                          <p className="mt-1 line-clamp-2 text-[10px] text-slate-500">
                            {selectedBrand.tagline}
                          </p>
                        )}
                      </div>

                      <div
                        className="h-8 w-8 shrink-0 rounded-xl border border-black/10 shadow-sm"
                        style={{ backgroundColor: formData.hex }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                      <span className="truncate font-mono text-slate-500">
                        {formData.code || 'No code'}
                      </span>
                      <span className="shrink-0 font-bold text-slate-900">
                        ₹{formData.pricePer4L.toLocaleString('en-IN')} / 4L
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {formData.category}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                        {formData.finish}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || availableBrands.length === 0}
                  className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : colorToEdit
                      ? 'Update Colour'
                      : 'Save Colour'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
