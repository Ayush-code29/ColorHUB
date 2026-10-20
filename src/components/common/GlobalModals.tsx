'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import ProductDetailModal from '@/components/modals/ProductDetailModal';
import ConsultationModal from '@/components/modals/ConsultationModal';
import PaintCalculatorModal from '@/components/tools/PaintCalculatorModal';
import CheckoutModal from '@/components/modals/CheckoutModal';
import AdminAddColorModal from '@/components/modals/AdminAddColorModal';
import CartDrawer from '@/components/cart/CartDrawer';
import Toast from '@/components/common/Toast';

export default function GlobalModals() {
  const { modal } = useStore();

  return (
    <>
      <CartDrawer />
      <Toast />

      {modal.type === 'product' && modal.data && (
        <ProductDetailModal color={modal.data} />
      )}
      {modal.type === 'consultation' && <ConsultationModal />}
      {modal.type === 'calculator' && <PaintCalculatorModal />}
      {modal.type === 'checkout' && <CheckoutModal />}
      {modal.type === 'admin-add' && <AdminAddColorModal colorToEdit={modal.data} />}
    </>
  );
}
