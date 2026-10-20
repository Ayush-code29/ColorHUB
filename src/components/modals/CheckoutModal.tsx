'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, CheckCircle2, ShoppingBag, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutModal() {
  const { closeModal, cart, cartTotal, placeOrder } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cod',
  });
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder(formData);
    if (order) {
      setCompletedOrder(order);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeModal}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-3xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-100 p-6 sm:p-8">
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {completedOrder ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Order Placed Successfully!</h2>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 inline-block text-left text-xs space-y-1">
                <p className="text-slate-500">Order ID: <strong className="text-slate-900 font-mono">{completedOrder.id}</strong></p>
                <p className="text-slate-500">Total Paid: <strong className="text-slate-900 font-bold">₹{completedOrder.totalAmount.toLocaleString('en-IN')}</strong></p>
                <p className="text-slate-500">Delivery To: <strong className="text-slate-900">{completedOrder.customerName}</strong> ({completedOrder.phone})</p>
                <p className="text-slate-400 text-[11px] mt-2">Expected delivery in 24-48 hours via express paint courier.</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Return to Store
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Express Checkout
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">Delivery & Payment Details</h2>
              <p className="text-xs text-slate-500 mb-6">Complete your order for genuine brand-sealed paint cans.</p>

              {/* Order summary mini */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-5 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-800">{cart.length} item(s)</span>
                  <span className="text-slate-400 block text-[11px]">Free express door delivery</span>
                </div>
                <span className="text-base font-bold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Address & Pincode</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Flat/House no, Street, Landmark, City, Pincode"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'cod'
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-slate-800">Cash on Delivery</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'online'
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-semibold text-slate-800">UPI / Cards / NetBanking</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md shadow-amber-600/20 transition-all hover:scale-[1.01]"
                >
                  Confirm & Place Order (₹{cartTotal.toLocaleString('en-IN')})
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
