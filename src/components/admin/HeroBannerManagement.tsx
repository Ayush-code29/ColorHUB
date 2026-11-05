
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ImagePlus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Images,
  Pencil,
  X,
  Save,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  accentShade: string;
  accentHex: string;
  isActive: boolean;
  order: number;
  source?: "default" | "upload";
};

type FormState = {
  title: string;
  subtitle: string;
  accentShade: string;
  accentHex: string;
  order: string;
  isActive: boolean;
};

const initialForm: FormState = {
  title: "",
  subtitle: "",
  accentShade: "",
  accentHex: "#B58A45",
  order: "0",
  isActive: true,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export default function HeroBannerManagement() {
  const { showToast } = useStore();

  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [visibilityId, setVisibilityId] = useState<string | null>(null);

  async function loadSlides() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/hero-slides", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load hero images.");
      }

      setSlides(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to load hero images.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSlides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setForm(initialForm);
    setImage(null);
    setPreview("");
    setEditingId(null);
  }

  function handleImageChange(file?: File) {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      showToast("Please select a JPG, PNG, WEBP or AVIF image.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image size must be 5 MB or smaller.", "error");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function startEditing(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      accentShade: slide.accentShade,
      accentHex: slide.accentHex,
      order: String(slide.order),
      isActive: slide.isActive,
    });
    setImage(null);
    setPreview(slide.imageUrl);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    if (!editingId && !image) {
      showToast("Please select a hero banner image.", "error");
      return;
    }

    setSaving(true);

    try {
      const body = new FormData();

      if (image) body.append("image", image);

      body.append("title", form.title.trim());
      body.append("subtitle", form.subtitle.trim());
      body.append("accentShade", form.accentShade.trim());
      body.append("accentHex", form.accentHex);
      body.append("order", form.order);
      body.append("isActive", String(form.isActive));

      const response = await fetch(
        editingId
          ? `/api/admin/hero-slides/${editingId}`
          : "/api/admin/hero-slides",
        {
          method: editingId ? "PATCH" : "POST",
          body,
          credentials: "same-origin",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            (editingId
              ? "Unable to update hero image."
              : "Unable to upload hero image.")
        );
      }

      showToast(
        editingId
          ? "Hero banner updated successfully."
          : "Hero banner image added successfully.",
        "success"
      );

      resetForm();
      await loadSlides();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to save hero image.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slide: HeroSlide) {
    const confirmed = window.confirm(
      `Permanently delete "${slide.title}" from the homepage?`
    );

    if (!confirmed) return;

    setDeletingId(slide.id);

    try {
      const response = await fetch(
        `/api/admin/hero-slides/${slide.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete image.");
      }

      setSlides((current) =>
        current.filter((item) => item.id !== slide.id)
      );

      if (editingId === slide.id) resetForm();

      showToast(data.message || "Hero image deleted.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to delete image.",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleVisibility(slide: HeroSlide) {
    setVisibilityId(slide.id);

    try {
      const response = await fetch(
        `/api/admin/hero-slides/${slide.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify({
            isActive: !slide.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      setSlides((current) =>
  current.map((item) =>
    item.id === slide.id
      ? { ...item, isActive: data.slide.isActive }
      : item
  )
);

      showToast(
        slide.isActive
          ? "Hero image hidden from homepage."
          : "Hero image visible on homepage.",
        "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update visibility.",
        "error"
      );
    } finally {
      setVisibilityId(null);
    }
  }

  return (
    <section className="space-y-6">
      {/* Add / Edit form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
            {editingId ? <Pencil size={21} /> : <ImagePlus size={21} />}
          </div>

          <div className="flex-1">
            <h2 className="text-base font-bold text-slate-900">
              {editingId ? "Edit Hero Banner" : "Add Hero Banner Image"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {editingId
                ? "Update the slide details or optionally replace its image."
                : "Add a new slide to the homepage hero carousel. Recommended: landscape image, maximum 5 MB."}
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              <X size={14} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Main heading *
            <input
              required
              maxLength={140}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Beautiful Spaces Start with the Right Colour"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Featured shade *
            <input
              required
              maxLength={80}
              value={form.accentShade}
              onChange={(event) =>
                setForm({ ...form, accentShade: event.target.value })
              }
              placeholder="Terracotta • AP-450"
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 md:col-span-2">
            Subtitle *
            <textarea
              required
              maxLength={400}
              rows={3}
              value={form.subtitle}
              onChange={(event) =>
                setForm({ ...form, subtitle: event.target.value })
              }
              placeholder="Write a short description for this slide..."
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Accent colour
            <div className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3">
              <input
                type="color"
                value={form.accentHex}
                onChange={(event) =>
                  setForm({ ...form, accentHex: event.target.value })
                }
                className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent"
              />
              <span className="text-xs font-medium uppercase text-slate-600">
                {form.accentHex}
              </span>
            </div>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Display order
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(event) =>
                setForm({ ...form, order: event.target.value })
              }
              className={inputClass}
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700 md:col-span-2">
            {editingId ? "Replace image (optional)" : "Hero image *"}
            <input
              type="file"
              required={!editingId}
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) =>
                handleImageChange(event.target.files?.[0])
              }
              className={inputClass}
            />
          </label>

          {preview && (
            <div className="md:col-span-2">
              <p className="mb-2 text-xs font-semibold text-slate-600">
                Image preview
              </p>
              <img
                src={preview}
                alt="Hero banner preview"
                className="h-52 w-full rounded-2xl bg-slate-100 object-cover"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
              className="h-4 w-4 accent-amber-600"
            />
            Show this image on homepage
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : editingId ? (
                <Save size={16} />
              ) : (
                <Upload size={16} />
              )}
              {saving
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Upload Hero Image"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              {editingId ? "Cancel" : "Reset"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing images */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Homepage Hero Images
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage default and uploaded images displayed in the homepage carousel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {slides.length} images
            </span>

            <button
              type="button"
              onClick={() => void loadSlides()}
              aria-label="Refresh hero images"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-400">
            <RefreshCw size={16} className="animate-spin" />
            Loading hero images...
          </div>
        ) : slides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center">
            <Images className="mx-auto mb-3 text-slate-300" size={30} />
            <p className="text-sm font-semibold text-slate-700">
              No hero images available
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Upload a new image to display it on your homepage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {slides.map((slide) => (
              <article
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <div className="relative">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="h-52 w-full bg-slate-100 object-cover"
                  />

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold ${
                      slide.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-900/80 text-white"
                    }`}
                  >
                    {slide.isActive ? "LIVE ON WEBSITE" : "HIDDEN"}
                  </span>

                  <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
                    Order: {slide.order}
                  </span>

                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-slate-700">
                    {slide.source === "default" ? "Default image" : "Uploaded"}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {slide.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {slide.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className="h-4 w-4 rounded-full border border-black/10"
                      style={{ backgroundColor: slide.accentHex }}
                    />
                    {slide.accentShade}
                  </div>

                  <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => startEditing(slide)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={visibilityId === slide.id}
                      onClick={() => void toggleVisibility(slide)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {visibilityId === slide.id ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : slide.isActive ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                      {slide.isActive ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      disabled={deletingId === slide.id}
                      onClick={() => void handleDelete(slide)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      {deletingId === slide.id ? (
                        <RefreshCw size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
