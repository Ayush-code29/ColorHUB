
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  Palette,
  LayoutDashboard,
  Layers,
  Building2,
  LogOut,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  ImagePlus,
  Megaphone,
} from "lucide-react";
import type { PaintColor } from "@/types";

type AdminTab = "dashboard" | "colours" | "brands" | "offers";

type Offer = {
  id: string;
  label: string;
  heading: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
};

export default function AdminDashboard() {
  const router = useRouter();

  const {
    colors,
    brands,
    updateColor,
    deleteColor,
    openAdminAddModal,
    showToast,
    addBrand,
    deleteBrand,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [brandName, setBrandName] = useState("");
  const [brandTagline, setBrandTagline] = useState("");
  const [addingBrand, setAddingBrand] = useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [addingOffer, setAddingOffer] = useState(false);
  const [deletingOfferId, setDeletingOfferId] = useState<string | null>(null);
  const [offerImage, setOfferImage] = useState<File | null>(null);

  const [offerForm, setOfferForm] = useState({
    label: "",
    heading: "",
    description: "",
    buttonText: "Shop Now",
    buttonLink: "#colours-section",
    order: "0",
    isActive: true,
  });

  async function loadOffers() {
    setOffersLoading(true);

    try {
      const response = await fetch("/api/admin/offers", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load offers.");
      }

      setOffers(Array.isArray(data) ? data : []);
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to load offers.",
        "error"
      );
    } finally {
      setOffersLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "offers") {
      void loadOffers();
    }
  }, [activeTab]);

  async function handleAddOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!offerImage || addingOffer) {
      if (!offerImage) {
        showToast("Please choose an offer image.", "error");
      }
      return;
    }

    setAddingOffer(true);

    try {
      const body = new FormData();

      body.append("image", offerImage);
      body.append("label", offerForm.label);
      body.append("heading", offerForm.heading);
      body.append("description", offerForm.description);
      body.append("buttonText", offerForm.buttonText);
      body.append("buttonLink", offerForm.buttonLink);
      body.append("order", offerForm.order);
      body.append("isActive", String(offerForm.isActive));

      const response = await fetch("/api/admin/offers", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add offer.");
      }

      showToast("Offer added successfully.", "success");

      setOfferForm({
        label: "",
        heading: "",
        description: "",
        buttonText: "Shop Now",
        buttonLink: "#colours-section",
        order: "0",
        isActive: true,
      });

      setOfferImage(null);

      const fileInput = document.getElementById(
        "offer-image"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadOffers();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to add offer.",
        "error"
      );
    } finally {
      setAddingOffer(false);
    }
  }

  async function handleDeleteOffer(offer: Offer) {
    if (
      deletingOfferId ||
      !window.confirm(
        `Permanently delete offer "${offer.heading}" and its Cloudinary image?`
      )
    ) {
      return;
    }

    setDeletingOfferId(offer.id);

    try {
      const response = await fetch(
        `/api/admin/offers/${offer.id}`,
        { method: "DELETE" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete offer.");
      }

      setOffers((current) =>
        current.filter((item) => item.id !== offer.id)
      );

      showToast(
        data.message || "Offer deleted.",
        data.cloudinaryCleanupFailed ? "error" : "success"
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to delete offer.",
        "error"
      );
    } finally {
      setDeletingOfferId(null);
    }
  }

  const filteredColors = colors.filter((color) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      color.name.toLowerCase().includes(query) ||
      color.brand.toLowerCase().includes(query) ||
      color.code.toLowerCase().includes(query) ||
      color.category.toLowerCase().includes(query)
    );
  });

  
async function handleLogout() {
  if (loggingOut) return;

  setLoggingOut(true);

  try {
    const response = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });

    if (!response.ok) {
      showToast("Logout failed. Please try again.", "error");
      return;
    }

    router.replace("/admin_paint/login");
    router.refresh();
  } catch {
    showToast("Unable to connect to the server.", "error");
  } finally {
    setLoggingOut(false);
  }
}


  async function handleDeleteColor(id: string) {
    if (
      deletingId ||
      !window.confirm("Permanently delete this colour?")
    ) {
      return;
    }

    setDeletingId(id);

    try {
      await deleteColor(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAddBrand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = brandName.trim();
    const tagline = brandTagline.trim();

    if (!name || !tagline || addingBrand) return;

    setAddingBrand(true);

    try {
      const success = await addBrand({ name, tagline });

      if (success) {
        setBrandName("");
        setBrandTagline("");
      }
    } finally {
      setAddingBrand(false);
    }
  }

  async function handleDeleteBrand(id: string, name: string) {
    if (
      !window.confirm(
        `Delete "${name}"? A brand cannot be deleted while paint colours use it.`
      )
    ) {
      return;
    }

    await deleteBrand(id);
  }

  const navItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "colours" as const,
      label: "Colours & Products",
      icon: Layers,
      count: colors.length,
    },
    {
      id: "brands" as const,
      label: "Brand Management",
      icon: Building2,
      count: brands.length,
    },
    {
      id: "offers" as const,
      label: "Offers Management",
      icon: Megaphone,
      count: offers.length,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans md:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-slate-900 text-slate-300 md:w-64">
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
              <Palette className="h-4 w-4" />
            </div>

            <span className="text-lg font-extrabold text-white">
              Color<span className="text-amber-500">Hub</span>
            </span>
          </Link>

          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
            ADMIN
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-4 text-xs font-semibold">
          {navItems.map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                activeTab === id
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>

              {count !== undefined && (
                <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  {count}
                </span>
              )}
            </button>
          ))}

          <div className="mt-4 border-t border-slate-800 px-3 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick Actions
          </div>

          <button
            type="button"
            onClick={() => openAdminAddModal()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-amber-400 hover:bg-amber-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Shade</span>
          </button>

          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Store</span>
          </Link>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>
              {loggingOut ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>
      </aside>

      <main className="w-full max-w-7xl flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {activeTab === "dashboard"
                ? "Admin Dashboard"
                : activeTab === "colours"
                  ? "Colours & Products"
                  : activeTab === "brands"
                    ? "Brand Management"
                    : "Offers Management"}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage your paint catalogue, brands and homepage offers.
            </p>
          </div>

          {activeTab !== "brands" && activeTab !== "offers" && (
            <button
              type="button"
              onClick={() => openAdminAddModal()}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
            >
              <Plus className="h-4 w-4 text-amber-400" />
              Add Product / Colour
            </button>
          )}
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                label="Total Products"
                value={String(colors.length)}
                caption="Catalogue entries"
              />
              <StatCard
                label="Active Colours"
                value={String(
                  colors.filter((color) => color.isActive).length
                )}
                caption="Currently visible"
              />
              <StatCard
                label="Total Brands"
                value={String(brands.length)}
                caption="Managed brand records"
              />
            </div>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Products & Colours
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage catalogue entries
                  </p>
                </div>

                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
              </div>

              <ColorTable
                colors={filteredColors}
                onEdit={openAdminAddModal}
                onDelete={handleDeleteColor}
                onToggle={(color) =>
                  updateColor(color.id, {
                    isActive: !color.isActive,
                  })
                }
                deletingId={deletingId}
              />
            </section>
          </div>
        )}

        {activeTab === "colours" && (
          <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Catalogue Management
                </h2>
                <p className="text-xs text-slate-500">
                  Manage shades, categories, codes, previews and prices.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openAdminAddModal()}
                className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                <Plus className="h-4 w-4" />
                Add New Colour
              </button>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
            />

            <ColorTable
              colors={filteredColors}
              onEdit={openAdminAddModal}
              onDelete={handleDeleteColor}
              onToggle={(color) =>
                updateColor(color.id, {
                  isActive: !color.isActive,
                })
              }
              deletingId={deletingId}
            />
          </section>
        )}

        {activeTab === "brands" && (
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Add New Brand
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Both brand name and tagline are required.
              </p>

              <form
                onSubmit={handleAddBrand}
                className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="brand-name"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Brand Name *
                  </label>

                  <input
                    id="brand-name"
                    value={brandName}
                    onChange={(event) =>
                      setBrandName(event.target.value)
                    }
                    maxLength={80}
                    required
                    placeholder="e.g. Asian Paints"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="brand-tagline"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Brand Tagline *
                  </label>

                  <input
                    id="brand-tagline"
                    value={brandTagline}
                    onChange={(event) =>
                      setBrandTagline(event.target.value)
                    }
                    maxLength={180}
                    required
                    placeholder="Enter the brand tagline"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    disabled={
                      addingBrand ||
                      !brandName.trim() ||
                      !brandTagline.trim()
                    }
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    {addingBrand ? "Adding Brand..." : "Add Brand"}
                  </button>
                </div>
              </form>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {brands.map((brand) => (
                <article
                  key={brand.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Building2 className="h-5 w-5" />
                    </div>

                    <h3 className="font-bold text-slate-900">
                      {brand.name}
                    </h3>

                    <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                      {brand.tagline || "No tagline added"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteBrand(brand.id, brand.name)
                    }
                    aria-label={`Delete ${brand.name}`}
                    title="Delete brand"
                    className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </article>
              ))}

              {brands.length === 0 && (
                <EmptyState message="No brands available." />
              )}
            </div>
          </section>
        )}

        {activeTab === "offers" && (
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Add Homepage Offer
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                The image is uploaded to Cloudinary. All fields are required.
              </p>

              <form
                onSubmit={handleAddOffer}
                className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
              >
                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Label *
                  <input
                    required
                    maxLength={60}
                    value={offerForm.label}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        label: event.target.value,
                      })
                    }
                    placeholder="FESTIVE OFFER"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Heading *
                  <input
                    required
                    maxLength={140}
                    value={offerForm.heading}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        heading: event.target.value,
                      })
                    }
                    placeholder="Up to 30% OFF on selected products"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700 md:col-span-2">
                  Description *
                  <textarea
                    required
                    maxLength={400}
                    rows={2}
                    value={offerForm.description}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        description: event.target.value,
                      })
                    }
                    placeholder="Describe the offer"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Image * (JPG/PNG/WEBP/AVIF, max 5 MB)
                  <input
                    id="offer-image"
                    required
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    onChange={(event) =>
                      setOfferImage(
                        event.target.files?.[0] || null
                      )
                    }
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Button text *
                  <input
                    required
                    maxLength={40}
                    value={offerForm.buttonText}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        buttonText: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Button link *
                  <input
                    required
                    maxLength={500}
                    value={offerForm.buttonLink}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        buttonLink: event.target.value,
                      })
                    }
                    placeholder="#colours-section"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="space-y-1.5 text-xs font-semibold text-slate-700">
                  Display order
                  <input
                    type="number"
                    value={offerForm.order}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        order: event.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={offerForm.isActive}
                    onChange={(event) =>
                      setOfferForm({
                        ...offerForm,
                        isActive: event.target.checked,
                      })
                    }
                  />
                  Show on homepage
                </label>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={addingOffer}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    <ImagePlus className="h-4 w-4 text-amber-400" />
                    {addingOffer
                      ? "Uploading and saving..."
                      : "Add Offer"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-slate-900">
                    Existing Offers
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {offers.length} offer(s)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void loadOffers()}
                  className="rounded-lg border px-3 py-2 text-xs"
                >
                  Refresh
                </button>
              </div>

              {offersLoading ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading offers...
                </p>
              ) : offers.length === 0 ? (
                <EmptyState message="No offers yet. Add your first offer above." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {offers.map((offer) => (
                    <article
                      key={offer.id}
                      className="overflow-hidden rounded-2xl border border-slate-200"
                    >
                      <img
                        src={offer.imageUrl}
                        alt={offer.heading}
                        className="h-40 w-full object-cover"
                      />

                      <div className="p-4">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">
                            {offer.label}
                          </span>

                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                              offer.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {offer.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900">
                          {offer.heading}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {offer.description}
                        </p>

                        <button
                          type="button"
                          onClick={() => void handleDeleteOffer(offer)}
                          disabled={deletingOfferId === offer.id}
                          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-100 px-3 py-2 text-xs font-bold text-rose-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {deletingOfferId === offer.id
                            ? "Deleting..."
                            : "Delete Offer"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <div className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
        {value}
      </div>

      <span className="text-[11px] font-medium text-slate-500">
        {caption}
      </span>
    </div>
  );
}

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search name, brand or code..."
        aria-label="Search colours"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-amber-500/20"
      />
    </div>
  );
}

function ColorTable({
  colors,
  onEdit,
  onDelete,
  onToggle,
  deletingId,
}: {
  colors: PaintColor[];
  onEdit: (color?: PaintColor) => void;
  onDelete: (id: string) => void;
  onToggle: (color: PaintColor) => void;
  deletingId: string | null;
}) {
  if (colors.length === 0) {
    return <EmptyState message="No colours match your search." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Brand / Category</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
          {colors.map((color) => (
            <tr
              key={color.id}
              className="transition-colors hover:bg-slate-50/70"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="h-7 w-7 shrink-0 rounded-lg border border-black/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />

                  <div>
                    <span className="block font-bold text-slate-900">
                      {color.name}
                    </span>

                    <span className="font-mono text-[11px] text-slate-400">
                      {color.code}
                    </span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="font-semibold text-slate-800">
                  {color.brand}
                </span>

                <span className="block text-[10px] capitalize text-slate-400">
                  {color.category}
                </span>
              </td>

              <td className="px-6 py-4 font-bold text-slate-900">
                ₹{color.pricePer4L.toLocaleString("en-IN")}
              </td>

              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onToggle(color)}
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    color.isActive
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-slate-100 text-slate-500"
                  }`}
                >
                  {color.isActive ? "Active" : "Inactive"}
                </button>
              </td>

              <td className="space-x-2 px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(color)}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                >
                  Edit
                </button>

                <button
                  type="button"
                  disabled={deletingId === color.id}
                  onClick={() => onDelete(color.id)}
                  title="Delete colour"
                  aria-label={`Delete ${color.name}`}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                >
                  <Trash2 className="inline h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
