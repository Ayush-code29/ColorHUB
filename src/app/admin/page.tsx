'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import {
  Palette,
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { PaintColor } from '@/types';

type AdminTab = 'dashboard' | 'colours' | 'orders' | 'inquiries';

export default function AdminPage() {
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

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColors = colors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar (matches bottom-center mockup) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white">
              <Palette className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-white">
              Color<span className="text-amber-500">Hub</span>
            </span>
          </Link>
          <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
            ADMIN
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('colours')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
              activeTab === 'colours'
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Colours &amp; Products</span>
            <span className="ml-auto bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
              {colors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
              activeTab === 'orders'
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            <span className="ml-auto bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[10px]">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-amber-500/10 text-amber-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Consultation Leads</span>
            <span className="ml-auto bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full text-[10px]">
              {inquiries.length}
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3">
            Quick Actions
          </div>

          <button
            onClick={() => openAdminAddModal()}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shade</span>
          </button>

          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Store</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Admin Panel</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
              {activeTab === 'dashboard' ? 'Admin Dashboard' : activeTab}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Store management, live catalogue updates, inventory pricing &amp; customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openAdminAddModal()}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ Add Product / Colour</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards Row (matching bottom-center mockup: 248, 1236, 6, 124) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-400">Total Products</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">248</div>
                <span className="text-[11px] text-emerald-600 font-medium">In stock across all series</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-400">Total Colours</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {1220 + colors.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Available in visualizer</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-400">Total Brands</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {brands.length}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Authorized distributors</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <span className="text-xs font-semibold text-slate-400">Total Orders</span>
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {124 + orders.length - 3}
                </div>
                <span className="text-[11px] text-amber-600 font-medium">
                  ₹{(482500 + totalRevenue).toLocaleString('en-IN')} revenue
                </span>
              </div>
            </div>

            {/* Recent Products Table (exact replica of bottom-center mockup) */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Recent Products &amp; Colours</h3>
                  <p className="text-xs text-slate-500">Live catalogue inventory and pricing</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Filter shades..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <button
                    onClick={() => openAdminAddModal()}
                    className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-6">Name</th>
                      <th className="py-3 px-6">Brand</th>
                      <th className="py-3 px-6">Price</th>
                      <th className="py-3 px-6">Status</th>
                      <th className="py-3 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredColors.map((color) => (
                      <tr key={color.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name + Swatch */}
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div
                            className="w-7 h-7 rounded-lg border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{color.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">{color.code}</span>
                          </div>
                        </td>

                        {/* Brand */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-800">{color.brand}</span>
                          <span className="text-[10px] text-slate-400 block">{color.category}</span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ₹{color.pricePer4L.toLocaleString('en-IN')}
                        </td>

                        {/* Status Toggle Badge */}
                        <td className="py-4 px-6">
                          <button
                            onClick={() => updateColor(color.id, { isActive: !color.isActive })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                              color.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {color.isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openAdminAddModal(color)}
                            className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteColor(color.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLOURS & PRODUCTS MANAGEMENT */}
        {activeTab === 'colours' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Catalogue Management</h3>
                <p className="text-xs text-slate-500">Edit codes, swatches, room previews and descriptions</p>
              </div>
              <button
                onClick={() => openAdminAddModal()}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Colour</span>
              </button>
            </div>

            {/* Grid of editable cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredColors.map((color) => (
                <div
                  key={color.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-xl border border-black/10 shadow-xs shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{color.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">{color.code} • {color.brand}</p>
                      <p className="text-[11px] text-amber-700 font-medium">₹{color.pricePer4L} / 4L</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{color.description}</p>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        color.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {color.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openAdminAddModal(color)}
                        className="px-3 py-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteColor(color.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Orders</h3>
              <p className="text-xs text-slate-500">Track paint deliveries, addresses, and fulfillment status</p>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                        <span className="text-xs text-slate-400">• {order.createdAt}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">
                        {order.customerName} ({order.phone})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-extrabold text-slate-900">
                        ₹{order.totalAmount.toLocaleString('en-IN')}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-700">Delivery Address:</p>
                    <p>{order.address}</p>
                    <p className="text-slate-400 mt-1 font-medium">Email: {order.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-2 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/10"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                        <span className="text-slate-500">({item.packSize} x {item.quantity})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CONSULTATION INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Home Consultation Requests</h3>
              <p className="text-xs text-slate-500">Leads generated via "Free Home Colour Consultation"</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-slate-400">{inq.id}</span>
                      <h4 className="font-bold text-sm text-slate-900">{inq.name}</h4>
                      <p className="text-xs text-amber-700 font-semibold">{inq.propertyType}</p>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {inq.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inq.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inq.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inq.city}</span>
                    </div>
                  </div>

                  {inq.notes && (
                    <p className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                      "{inq.notes}"
                    </p>
                  )}

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>Preferred Date: <strong className="text-slate-700">{inq.preferredDate}</strong></span>
                    <span>Received: {inq.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
