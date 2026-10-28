
"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ImagePlus,
  Pencil,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

type WorkItem = {
  id: string;
  title: string;
  colorName: string;
  category: string;
  brandName: string;
  imageUrl: string;
  imagePublicId?: string;
  isActive: boolean;
  order: number;
};

type FormState = {
  title: string;
  colorName: string;
  category: string;
  brandName: string;
  order: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  title: "",
  colorName: "",
  category: "emulsion",
  brandName: "",
  order: "0",
  isActive: true,
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-normal outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10";

const categories = [
  { value: "emulsion", label: "Emulsion" },
  { value: "enamel", label: "Enamel" },
  { value: "distemper", label: "Distemper" },
  { value: "acrylic", label: "Acrylic" },
  { value: "cement", label: "Cement" },
];

export default function WorkManagement() {
  const { showToast } = useStore();

  const [items, setItems] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editing, setEditing] = useState<WorkItem | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  async function loadItems() {
    setLoading(true);

    try {
      const response = await fetch("/api/admin/work", {
        cache: "no-store",
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load gallery.");
      }

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to load gallery.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadItems();
    // Load once when the admin gallery panel mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setImagePreview("");
  }

  function startEdit(item?: WorkItem) {
    setEditing(item || null);

    setForm(
      item
        ? {
            title: item.title,
            colorName: item.colorName,
            category: item.category,
            brandName: item.brandName,
            order: String(item.order ?? 0),
            isActive: item.isActive,
          }
        : emptyForm
    );

    setImage(null);
    setImagePreview(item?.imageUrl || "");

    if (!item) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function chooseImage(file?: File) {
    setImage(file || null);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(editing?.imageUrl || "");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    if (!editing && !image) {
      showToast("Please select a project image.", "error");
      return;
    }

    setSaving(true);

    try {
      const body = new FormData();

      body.append("title", form.title.trim());
      body.append("colorName", form.colorName.trim());
      body.append("category", form.category);
      body.append("brandName", form.brandName.trim());
      body.append("order", form.order);
      body.append("isActive", String(form.isActive));

      if (image) {
        body.append("image", image);
      }

      const url = editing
        ? `/api/admin/work/${editing.id}`
        : "/api/admin/work";

      const response = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        body,
        credentials: "same-origin",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project.");
      }

      showToast(
        editing
          ? "Our Work project updated."
          : "Project added to Our Work.",
        "success"
      );

      resetForm();
      await loadItems();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to save project.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: WorkItem) {
    const confirmed = window.confirm(
      `Permanently delete "${item.colorName}" from Our Work?`
    );

    if (!confirmed) return;

    setDeleting(item.id);

    try {
      const response = await fetch(
        `/api/admin/work/${item.id}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project.");
      }

      setItems((current) =>
        current.filter((entry) => entry.id !== item.id)
      );

      if (editing?.id === item.id) {
        resetForm();
      }

      showToast("Gallery project deleted.", "success");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to delete project.",
        "error"
      );
    } finally {
      setDeleting(null);
    }
  }

  async function toggleVisibility(item: WorkItem) {
    const body = new FormData();

    body.append("title", item.title);
    body.append("colorName", item.colorName);
    body.append("category", item.category);
    body.append("brandName", item.brandName);
    body.append("order", String(item.order));
    body.append("isActive", String(!item.isActive));

    try {
      const response = await fetch(
        `/api/admin/work/${item.id}`,
        {
          method: "PATCH",
          body,
          credentials: "same-origin",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update visibility.");
      }

      setItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? { ...entry, isActive: !item.isActive }
            : entry
        )
      );

      showToast(
        item.isActive
          ? "Project hidden from homepage."
          : "Project visible on homepage.",
        "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update visibility.",
        "error"
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editing ? "Edit project" : "Add to Our Work"}
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload real project photos. JPG, PNG, WEBP or AVIF,
              maximum 5 MB.
            </p>
          </div>

          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              <X size={14} />
              Cancel
            </button>
          )}
        </div>

        <form
          onSubmit={submit}
          className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Project title *
            <input
              required
              maxLength={100}
              className={inputClass}
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="e.g. Warm & Welcoming"
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Color name *
            <input
              required
              maxLength={100}
              className={inputClass}
              value={form.colorName}
              onChange={(event) =>
                setForm({ ...form, colorName: event.target.value })
              }
              placeholder="e.g. Sandstone Beige"
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Category *
            <select
              required
              className={inputClass}
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            >
              {categories.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Brand name *
            <input
              required
              maxLength={80}
              className={inputClass}
              value={form.brandName}
              onChange={(event) =>
                setForm({ ...form, brandName: event.target.value })
              }
              placeholder="e.g. Asian Paints"
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            Display order
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.order}
              onChange={(event) =>
                setForm({ ...form, order: event.target.value })
              }
            />
          </label>

          <label className="space-y-1.5 text-xs font-semibold text-slate-700">
            {editing ? "Replace image (optional)" : "Project image *"}
            <input
              required={!editing}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className={inputClass}
              onChange={(event) =>
                chooseImage(event.target.files?.[0])
              }
            />
          </label>

          {imagePreview && (
            <div className="md:col-span-2">
              <p className="mb-2 text-xs font-semibold text-slate-600">
                Image preview
              </p>
              <img
                src={imagePreview}
                alt="Selected project preview"
                className="h-48 w-full rounded-2xl bg-slate-100 object-cover sm:w-96"
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
            Visible on public website
          </label>

          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : editing ? (
                <Save size={16} />
              ) : (
                <ImagePlus size={16} />
              )}

              {saving
                ? "Saving..."
                : editing
                  ? "Save changes"
                  : "Add to Our Work"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Gallery projects
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Edit details, replace photos, hide projects or delete them.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {items.length} items
            </span>

            <button
              type="button"
              onClick={() => void loadItems()}
              aria-label="Refresh gallery"
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {loading ? (
          <p className="py-8 text-sm text-slate-500">
            Loading gallery...
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-sm text-slate-500">
            No projects found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <img
                  src={item.imageUrl}
                  alt={item.colorName}
                  className="h-44 w-full bg-slate-100 object-cover"
                />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                        {item.brandName}
                      </p>
                      <h3 className="mt-1 font-bold text-slate-900">
                        {item.colorName}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.title} · {item.category}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Order: {item.order}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${
                        item.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.isActive ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        startEdit(item);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold hover:bg-slate-50"
                    >
                      <Pencil size={13} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => void toggleVisibility(item)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 py-2 text-xs font-bold hover:bg-slate-50"
                    >
                      {item.isActive ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                      {item.isActive ? "Hide" : "Show"}
                    </button>

                    <button
                      type="button"
                      disabled={deleting === item.id}
                      onClick={() => void deleteItem(item)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border border-rose-100 px-2 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {deleting === item.id ? "..." : "Delete"}
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
