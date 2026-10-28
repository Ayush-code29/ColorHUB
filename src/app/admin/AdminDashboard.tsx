
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import WorkManagement from "@/components/admin/WorkManagement";
import {
  Palette,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Users,
  LogOut,
  Plus,
  Trash2,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Images,
} from "lucide-react";

type AdminTab =
  | "dashboard"
  | "colours"
  | "orders"
  | "inquiries"
  | "work";

export default function AdminDashboard() {
  const router = useRouter();

  const {
    colors,
    brands,
    orders,
    inquiries,
    deleteColor,
    updateColor,
    openAdminAddModal,
    updateOrderStatus,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredColors = colors.filter((color) => {
    const query = searchQuery.trim().toLowerCase();

    return (
      color.name.toLowerCase().includes(query) ||
      color.brand.toLowerCase().includes(query) ||
      color.code.toLowerCase().includes(query)
    );
  });

  const totalRevenue = orders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );

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

      router.replace("/admin/login");
      router.refresh();
    } catch {
      showToast("Unable to connect to the server.", "error");
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleDeleteColor(id: string) {
    if (deletingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this colour?"
    );

    if (!confirmed) return;

    setDeletingId(id);

    try {
      await deleteColor(id);
    } finally {
      setDeletingId(null);
    }
  }

  const navItems: {
    id: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
    count?: number;
  }[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "colours",
      label: "Colours & Products",
      icon: Layers,
      count: colors.length,
    },
    {
      id: "orders",
      label: "Orders",
      icon: ShoppingBag,
      count: orders.length,
    },
    {
      id: "inquiries",
      label: "Consultation Leads",
      icon: Users,
      count: inquiries.length,
    },
    {
      id: "work",
      label: "Our Work Gallery",
      icon: Images,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans md:flex-row">
      {/* Sidebar */}
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
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 transition-colors ${
                  active
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>

                {item.count !== undefined && (
                  <span className="ml-auto rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <div className="mt-4 border-t border-slate-800 px-3 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Quick Actions
          </div>

          <button
            type="button"
            onClick={() => openAdminAddModal()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-amber-400 transition-colors hover:bg-amber-500/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Shade</span>
          </button>

          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Public Store</span>
          </Link>
        </nav>

        <div className="border-t border-slate-800 p-4 text-xs">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-semibold text-rose-300 transition-colors hover:bg-rose-500/10 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-full max-w-7xl flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold capitalize text-slate-900 sm:text-3xl">
              {activeTab === "dashboard"
                ? "Admin Dashboard"
                : activeTab === "colours"
                  ? "Colours & Products"
                  : activeTab === "inquiries"
                    ? "Consultation Leads"
                    : activeTab === "orders"
                      ? "Orders"
                      : "Our Work Gallery"}
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              {activeTab === "work"
                ? "Manage project photos and the inspiration gallery displayed on your homepage."
                : "Store management, catalogue updates, pricing and customer orders."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>

            {activeTab !== "work" && (
              <button
                type="button"
                onClick={() => openAdminAddModal()}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 text-amber-400" />
                Add Product / Colour
              </button>
            )}
          </div>
        </div>

        {/* Dashboard overview */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total Products"
                value={colors.length.toLocaleString("en-IN")}
                caption="Catalogue entries"
              />

              <StatCard
                label="Total Colours"
                value={colors.length.toLocaleString("en-IN")}
                caption="Managed in catalogue"
              />

              <StatCard
                label="Total Brands"
                value={brands.length.toLocaleString("en-IN")}
                caption="Available brands"
              />

              <StatCard
                label="Total Orders"
                value={orders.length.toLocaleString("en-IN")}
                caption={`₹${totalRevenue.toLocaleString("en-IN")} total order value`}
              />
            </div>

            <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Products & Colours
                  </h2>
                  <p className="text-xs text-slate-500">
                    Manage catalogue inventory and pricing
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

        {/* Catalogue management */}
        {activeTab === "colours" && (
          <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Catalogue Management
                </h2>
                <p className="text-xs text-slate-500">
                  Manage shades, codes, previews, descriptions and prices.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openAdminAddModal()}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700"
              >
                <Plus className="h-4 w-4" />
                Add New Colour
              </button>
            </div>

            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
            />

            {filteredColors.length === 0 ? (
              <EmptyState message="No colours match your search." />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredColors.map((color) => (
                  <div
                    key={color.id}
                    className="flex flex-col justify-between space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="h-12 w-12 shrink-0 rounded-xl border border-black/10 shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {color.name}
                        </h3>
                        <p className="font-mono text-xs text-slate-500">
                          {color.code} · {color.brand}
                        </p>
                        <p className="text-[11px] font-medium text-amber-700">
                          ₹{color.pricePer4L.toLocaleString("en-IN")} / 4L
                        </p>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-xs text-slate-600">
                      {color.description || "No description available."}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateColor(color.id, {
                            isActive: !color.isActive,
                          })
                        }
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                          color.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-200 text-slate-600"
                        }`}
                      >
                        {color.isActive ? "Active" : "Inactive"}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openAdminAddModal(color)}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={deletingId === color.id}
                          onClick={() => handleDeleteColor(color.id)}
                          aria-label={`Delete ${color.name}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Customer Orders
              </h2>
              <p className="text-xs text-slate-500">
                Track deliveries, customer addresses and order status.
              </p>
            </div>

            {orders.length === 0 ? (
              <EmptyState message="No orders available yet." />
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article
                    key={order.id}
                    className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {order.id}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">
                          · {order.createdAt}
                        </span>
                        <p className="mt-1 text-xs font-semibold text-slate-800">
                          {order.customerName} ({order.phone})
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </span>

                        <select
                          aria-label={`Status for order ${order.id}`}
                          value={order.status}
                          onChange={(event) =>
                            updateOrderStatus(
                              order.id,
                              event.target.value as typeof order.status
                            )
                          }
                          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-white p-3 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">
                        Delivery Address
                      </p>
                      <p>{order.address}</p>
                      <p className="mt-1 text-slate-400">
                        Email: {order.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs"
                        >
                          <span
                            className="h-3 w-3 rounded-full border border-black/10"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="font-semibold text-slate-800">
                            {item.name}
                          </span>
                          <span className="text-slate-500">
                            ({item.packSize} × {item.quantity})
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Consultation inquiries */}
        {activeTab === "inquiries" && (
          <section className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Home Consultation Requests
              </h2>
              <p className="text-xs text-slate-500">
                Leads from free home colour consultations.
              </p>
            </div>

            {inquiries.length === 0 ? (
              <EmptyState message="No consultation requests available yet." />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {inquiries.map((inquiry) => (
                  <article
                    key={inquiry.id}
                    className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-mono text-xs text-slate-400">
                          {inquiry.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {inquiry.name}
                        </h3>
                        <p className="text-xs font-semibold text-amber-700">
                          {inquiry.propertyType}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="space-y-2 rounded-xl border border-slate-100 bg-white p-3 text-xs text-slate-600">
                      <ContactRow icon={Phone} value={inquiry.phone} />
                      <ContactRow icon={Mail} value={inquiry.email} />
                      <ContactRow icon={MapPin} value={inquiry.city} />
                    </div>

                    {inquiry.notes && (
                      <p className="rounded-lg border border-amber-100 bg-amber-50/50 p-2.5 text-xs italic text-slate-600">
                        {inquiry.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap justify-between gap-2 pt-1 text-[11px] text-slate-400">
                      <span>
                        Preferred Date:{" "}
                        <strong className="text-slate-700">
                          {inquiry.preferredDate}
                        </strong>
                      </span>
                      <span>Received: {inquiry.createdAt}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Our Work Gallery */}
        {activeTab === "work" && <WorkManagement />}
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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
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
  colors: ReturnType<typeof useStore>["colors"];
  onEdit: (
    color?: Parameters<
      ReturnType<typeof useStore>["openAdminAddModal"]
    >[0]
  ) => void;
  onDelete: (id: string) => void;
  onToggle: (color: (typeof colors)[number]) => void;
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
            <th className="px-6 py-3">Brand</th>
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
                <span className="block text-[10px] text-slate-400">
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
                  className={`cursor-pointer rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
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
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                  Edit
                </button>

                <button
                  type="button"
                  disabled={deletingId === color.id}
                  onClick={() => onDelete(color.id)}
                  title="Delete colour"
                  aria-label={`Delete ${color.name}`}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-rose-600 disabled:opacity-50"
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

function ContactRow({
  icon: Icon,
  value,
}: {
  icon: typeof Phone;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      <span className="break-words">{value}</span>
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
