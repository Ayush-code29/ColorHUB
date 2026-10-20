'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PaintColor,
  BrandInfo,
  InspirationItem,
  CartItem,
  Order,
  ConsultationInquiry,
} from '@/types';
import {
  INITIAL_BRANDS,
  INITIAL_COLORS,
  INITIAL_INSPIRATIONS,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
} from '@/data/initialData';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ModalState {
  type: 'product' | 'consultation' | 'calculator' | 'checkout' | 'admin-add' | null;
  data?: any;
}

interface StoreContextType {
  colors: PaintColor[];
  brands: BrandInfo[];
  inspirations: InspirationItem[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  inquiries: ConsultationInquiry[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  modal: ModalState;
  openProductModal: (color: PaintColor) => void;
  openConsultationModal: () => void;
  openCalculatorModal: () => void;
  openCheckoutModal: () => void;
  openAdminAddModal: (colorToEdit?: PaintColor) => void;
  closeModal: () => void;
  selectedVisualizerColor: PaintColor;
  setSelectedVisualizerColor: (color: PaintColor) => void;
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  
  // CRUD actions
  addColor: (color: Omit<PaintColor, 'id'>) => void;
  updateColor: (id: string, updates: Partial<PaintColor>) => void;
  deleteColor: (id: string) => void;
  
  // Cart
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;
  
  // Wishlist
  toggleWishlist: (colorId: string) => void;
  isWishlisted: (colorId: string) => boolean;

  // Consultation & Orders
  bookConsultation: (data: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => void;
  placeOrder: (customer: { name: string; email: string; phone: string; address: string }) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<PaintColor[]>(INITIAL_COLORS);
  const [brands] = useState<BrandInfo[]>(INITIAL_BRANDS);
  const [inspirations] = useState<InspirationItem[]>(INITIAL_INSPIRATIONS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['ivory-mist', 'terracotta']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>(INITIAL_INQUIRIES);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [selectedVisualizerColor, setSelectedVisualizerColor] = useState<PaintColor>(INITIAL_COLORS[0]);
  const [toast, setToast] = useState<ToastState | null>(null);

  // Initialize from LocalStorage if available
  useEffect(() => {
    try {
      const savedColors = localStorage.getItem('colorhub_colors');
      if (savedColors) {
        setColors(JSON.parse(savedColors));
      }
      const savedCart = localStorage.getItem('colorhub_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('colorhub_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      const savedOrders = localStorage.getItem('colorhub_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      const savedInquiries = localStorage.getItem('colorhub_inquiries');
      if (savedInquiries) {
        setInquiries(JSON.parse(savedInquiries));
      }
    } catch (e) {
      console.error('Failed to load local storage', e);
    }
  }, []);

  // Save changes to LocalStorage
  const saveColors = (newColors: PaintColor[]) => {
    setColors(newColors);
    try {
      localStorage.setItem('colorhub_colors', JSON.stringify(newColors));
    } catch (e) {
      console.error(e);
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('colorhub_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error(e);
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    try {
      localStorage.setItem('colorhub_orders', JSON.stringify(newOrders));
    } catch (e) {
      console.error(e);
    }
  };

  const saveInquiries = (newInquiries: ConsultationInquiry[]) => {
    setInquiries(newInquiries);
    try {
      localStorage.setItem('colorhub_inquiries', JSON.stringify(newInquiries));
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Modals
  const openProductModal = (color: PaintColor) => setModal({ type: 'product', data: color });
  const openConsultationModal = () => setModal({ type: 'consultation' });
  const openCalculatorModal = () => setModal({ type: 'calculator' });
  const openCheckoutModal = () => setModal({ type: 'checkout' });
  const openAdminAddModal = (colorToEdit?: PaintColor) => setModal({ type: 'admin-add', data: colorToEdit });
  const closeModal = () => setModal({ type: null });

  // CRUD Colors
  const addColor = (newColorData: Omit<PaintColor, 'id'>) => {
    const id = newColorData.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const newColor: PaintColor = {
      ...newColorData,
      id,
      rating: 5.0,
      reviewsCount: 1,
    };
    const updated = [newColor, ...colors];
    saveColors(updated);
    showToast(`Added "${newColor.name}" to catalogue!`, 'success');
  };

  const updateColor = (id: string, updates: Partial<PaintColor>) => {
    const updated = colors.map((c) => (c.id === id ? { ...c, ...updates } : c));
    saveColors(updated);
    showToast('Color updated successfully!', 'success');
  };

  const deleteColor = (id: string) => {
    const item = colors.find((c) => c.id === id);
    const updated = colors.filter((c) => c.id !== id);
    saveColors(updated);
    showToast(`Deleted "${item?.name || 'Color'}"`, 'info');
  };

  // Cart
  const addToCart = (itemData: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(
      (item) => item.colorId === itemData.colorId && item.packSize === itemData.packSize
    );

    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += itemData.quantity;
    } else {
      const newItem: CartItem = {
        ...itemData,
        id: `${itemData.colorId}-${itemData.packSize}-${Date.now()}`,
      };
      updated = [newItem, ...cart];
    }

    saveCart(updated);
    showToast(`Added ${itemData.name} (${itemData.packSize}) to Cart!`, 'success');
  };

  const removeFromCart = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const updateCartQty = (id: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (colorId: string) => {
    let next: string[];
    if (wishlist.includes(colorId)) {
      next = wishlist.filter((id) => id !== colorId);
      showToast('Removed from saved shades', 'info');
    } else {
      next = [...wishlist, colorId];
      showToast('Saved to your favorites!', 'success');
    }
    setWishlist(next);
    try {
      localStorage.setItem('colorhub_wishlist', JSON.stringify(next));
    } catch (e) {
      console.error(e);
    }
  };

  const isWishlisted = (colorId: string) => wishlist.includes(colorId);

  // Consultations
  const bookConsultation = (data: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: ConsultationInquiry = {
      ...data,
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'New',
    };
    const updated = [newInquiry, ...inquiries];
    saveInquiries(updated);
    showToast('Consultation request booked! Our expert will call you shortly.', 'success');
  };

  // Orders
  const placeOrder = (customer: { name: string; email: string; phone: string; address: string }) => {
    if (cart.length === 0) return null;
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      items: [...cart],
      totalAmount: cartTotal,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [newOrder, ...orders];
    saveOrders(updated);
    clearCart();
    showToast(`Order #${newOrder.id} confirmed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    saveOrders(updated);
    showToast(`Order status updated to ${status}`, 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        colors,
        brands,
        inspirations,
        cart,
        wishlist,
        orders,
        inquiries,
        isCartOpen,
        setIsCartOpen,
        modal,
        openProductModal,
        openConsultationModal,
        openCalculatorModal,
        openCheckoutModal,
        openAdminAddModal,
        closeModal,
        selectedVisualizerColor,
        setSelectedVisualizerColor,
        toast,
        showToast,
        addColor,
        updateColor,
        deleteColor,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartItemsCount,
        toggleWishlist,
        isWishlisted,
        bookConsultation,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
