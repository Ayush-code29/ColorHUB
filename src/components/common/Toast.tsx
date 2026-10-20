'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function Toast() {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-200 bg-white shadow-xl shadow-emerald-950/10 text-slate-800',
    info: 'border-amber-200 bg-white shadow-xl shadow-amber-950/10 text-slate-800',
    error: 'border-rose-200 bg-white shadow-xl shadow-rose-950/10 text-slate-800',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bgStyles[toast.type]} font-medium text-sm max-w-md backdrop-blur-md`}
      >
        {icons[toast.type]}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
