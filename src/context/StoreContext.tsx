
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  PaintColor,
  BrandInfo,
  InspirationItem,
  CartItem,
  Order,
  ConsultationInquiry,
} from "@/types";

import {
  INITIAL_BRANDS,
  INITIAL_COLORS,
  INITIAL_INSPIRATIONS,
  INITIAL_ORDERS,
  INITIAL_INQUIRIES,
} from "@/data/initialData";

interface ToastState {
  message: string;
  type: "success" | "info" | "error";
}

interface ModalState {
  type:
    | "product"
    | "consultation"
    | "calculator"
    | "checkout"
    | "admin-add"
    | null;
  data?: any;
}

interface NewBrandData {
  name: string;
  tagline?: string;
  logoUrl?: string;
  accentColor?: string;
  popularSeries?: string;
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
  showToast: (
    message: string,
    type?: "success" | "info" | "error"
  ) => void;

  addColor: (
    color: Omit<PaintColor, "id">
  ) => Promise<boolean>;
  updateColor: (
    id: string,
    updates: Partial<PaintColor>
  ) => Promise<boolean>;
  deleteColor: (id: string) => Promise<boolean>;

  addBrand: (data: NewBrandData) => Promise<boolean>;
  deleteBrand: (id: string) => Promise<boolean>;

  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemsCount: number;

  toggleWishlist: (colorId: string) => void;
  isWishlisted: (colorId: string) => boolean;

  bookConsultation: (
    data: Omit<
      ConsultationInquiry,
      "id" | "createdAt" | "status"
    >
  ) => void;

  placeOrder: (
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    }
  ) => Order | null;

  updateOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => void;
}

const StoreContext = createContext<
  StoreContextType | undefined
>(undefined);

export function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [colors, setColors] =
    useState<PaintColor[]>(INITIAL_COLORS);

  const [brands, setBrands] =
    useState<BrandInfo[]>([]);

  const [inspirations] =
    useState<InspirationItem[]>(INITIAL_INSPIRATIONS);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] =
    useState<string[]>(["ivory-mist", "terracotta"]);

  const [orders, setOrders] =
    useState<Order[]>(INITIAL_ORDERS);

  const [inquiries, setInquiries] =
    useState<ConsultationInquiry[]>(INITIAL_INQUIRIES);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [modal, setModal] = useState<ModalState>({
    type: null,
  });

  const [selectedVisualizerColor, setSelectedVisualizerColor] =
    useState<PaintColor>(INITIAL_COLORS[0]);

  const [toast, setToast] =
    useState<ToastState | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBrands() {
      try {
        const response = await fetch("/api/admin/brands");

        if (!response.ok) {
          throw new Error("Failed to load brands.");
        }

        const data: BrandInfo[] = await response.json();

        if (!cancelled && Array.isArray(data)) {
          setBrands(data);
          try {
            localStorage.setItem("colorhub_brands", JSON.stringify(data));
          } catch {}
        }
      } catch (error) {
        console.error("Could not load brands:", error);
      }
    }

    async function loadColors() {
      try {
        const response = await fetch("/api/colors");

        if (!response.ok) {
          throw new Error("Failed to load the colour catalogue.");
        }

        const data: PaintColor[] = await response.json();

        if (!cancelled) {
          setColors(data);

          setSelectedVisualizerColor((current) => {
            return (
              data.find((color) => color.id === current.id) ??
              data[0] ??
              INITIAL_COLORS[0]
            );
          });
        }
      } catch (error) {
        console.error("Could not load colours:", error);
      }
    }

    void loadBrands();
    void loadColors();

    try {
      const savedBrands = localStorage.getItem("colorhub_brands");
      if (savedBrands) {
        setBrands(JSON.parse(savedBrands));
      }

      const savedCart = localStorage.getItem("colorhub_cart");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      const savedWishlist =
        localStorage.getItem("colorhub_wishlist");

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }

      const savedOrders =
        localStorage.getItem("colorhub_orders");

      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }

      const savedInquiries =
        localStorage.getItem("colorhub_inquiries");

      if (savedInquiries) {
        setInquiries(JSON.parse(savedInquiries));
      }
    } catch (error) {
      console.error("Failed to load local storage:", error);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);

    try {
      localStorage.setItem(
        "colorhub_cart",
        JSON.stringify(newCart)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);

    try {
      localStorage.setItem(
        "colorhub_orders",
        JSON.stringify(newOrders)
      );
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  };

  const saveInquiries = (
    newInquiries: ConsultationInquiry[]
  ) => {
    setInquiries(newInquiries);

    try {
      localStorage.setItem(
        "colorhub_inquiries",
        JSON.stringify(newInquiries)
      );
    } catch (error) {
      console.error("Failed to save inquiries:", error);
    }
  };

  const showToast = (
    message: string,
    type: "success" | "info" | "error" = "success"
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  const openProductModal = (color: PaintColor) =>
    setModal({ type: "product", data: color });

  const openConsultationModal = () =>
    setModal({ type: "consultation" });

  const openCalculatorModal = () =>
    setModal({ type: "calculator" });

  const openCheckoutModal = () =>
    setModal({ type: "checkout" });

  const openAdminAddModal = (
    colorToEdit?: PaintColor
  ) => setModal({ type: "admin-add", data: colorToEdit });

  const closeModal = () => setModal({ type: null });

  const addColor = async (
    newColorData: Omit<PaintColor, "id">
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(newColorData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to add colour."
        );
      }

      setColors((current) => [
        result as PaintColor,
        ...current,
      ]);

      showToast(
        `Added "${result.name}" to catalogue!`,
        "success"
      );

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to add colour.",
        "error"
      );

      return false;
    }
  };

  const updateColor = async (
    id: string,
    updates: Partial<PaintColor>
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/colors/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "same-origin",
          body: JSON.stringify(updates),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to update colour."
        );
      }

      setColors((current) =>
        current.map((color) =>
          color.id === id
            ? (result as PaintColor)
            : color
        )
      );

      setSelectedVisualizerColor((current) =>
        current.id === id
          ? (result as PaintColor)
          : current
      );

      showToast("Colour updated successfully!", "success");

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update colour.",
        "error"
      );

      return false;
    }
  };

  const deleteColor = async (
    id: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `/api/colors/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete colour."
        );
      }

      const item = colors.find(
        (color) => color.id === id
      );

      setColors((current) =>
        current.filter((color) => color.id !== id)
      );

      setWishlist((current) =>
        current.filter((colorId) => colorId !== id)
      );

      showToast(
        `Deleted "${item?.name || "Colour"}"`,
        "info"
      );

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to delete colour.",
        "error"
      );

      return false;
    }
  };

  // Create a brand through the protected backend API.
  const addBrand = async (
    data: NewBrandData
  ): Promise<boolean> => {
    try {
      const response = await fetch("/api/admin/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to add brand."
        );
      }

      setBrands((current) => {
        const exists = current.some(
          (brand) => brand.id === result.id
        );

        if (exists) return current;

        const updated = [...current, result as BrandInfo].sort(
          (a, b) => a.name.localeCompare(b.name)
        );

        try {
          localStorage.setItem("colorhub_brands", JSON.stringify(updated));
        } catch {}

        return updated;
      });

      showToast(
        `Added brand "${result.name}".`,
        "success"
      );

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to add brand.",
        "error"
      );

      return false;
    }
  };

  // Delete a brand through the protected backend API.
  
  // Delete a brand and all its associated colours.
  const deleteBrand = async (
    id: string
  ): Promise<boolean> => {
    try {
      // Find the brand before deleting it, for cart cleanup.
      const brandToDelete = brands.find(
        (brand) => brand.id === id
      );

      const response = await fetch(
        `/api/admin/brands/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          credentials: "same-origin",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete brand."
        );
      }

      // Identify all colours belonging to this brand.
      const deletedColors = colors.filter((color) => {
        const paintColor = color as PaintColor & {
          brandId?: string;
        };

        return (
          paintColor.brandId === id ||
          (
            !!brandToDelete &&
            color.brand === brandToDelete.name
          )
        );
      });

      const deletedColorIds = new Set(
        deletedColors.map((color) => color.id)
      );

      // Remove the brand from frontend state and sync localStorage.
      setBrands((current) => {
        const updated = current.filter((brand) => brand.id !== id);
        try {
          localStorage.setItem("colorhub_brands", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      // Remove all its colours from frontend state.
      setColors((current) =>
        current.filter((color) => !deletedColorIds.has(color.id))
      );

      // Remove deleted colours from the wishlist.
      setWishlist((current) => {
        const updated = current.filter(
          (colorId) => !deletedColorIds.has(colorId)
        );

        try {
          localStorage.setItem(
            "colorhub_wishlist",
            JSON.stringify(updated)
          );
        } catch (storageError) {
          console.error(
            "Failed to update saved wishlist:",
            storageError
          );
        }

        return updated;
      });

      // Remove deleted colours from the cart.
      setCart((current) => {
        const updated = current.filter(
          (item) => !deletedColorIds.has(item.colorId)
        );

        try {
          localStorage.setItem(
            "colorhub_cart",
            JSON.stringify(updated)
          );
        } catch (storageError) {
          console.error(
            "Failed to update saved cart:",
            storageError
          );
        }

        return updated;
      });

      // Select another colour if the selected one was deleted.
      setSelectedVisualizerColor((current) => {
        if (!deletedColorIds.has(current.id)) {
          return current;
        }

        return (
          colors.find(
            (color) => !deletedColorIds.has(color.id)
          ) ?? INITIAL_COLORS[0]
        );
      });

      showToast(
        result.message || "Brand and associated colours deleted successfully.",
        "success"
      );

      return true;
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to delete brand.",
        "error"
      );

      return false;
    }
  };


  const addToCart = (itemData: Omit<CartItem, "id">) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item.colorId === itemData.colorId &&
        item.packSize === itemData.packSize
    );

    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = [...cart];

      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity:
          updated[existingIndex].quantity +
          itemData.quantity,
      };
    } else {
      const newItem: CartItem = {
        ...itemData,
        id: `${itemData.colorId}-${itemData.packSize}-${Date.now()}`,
      };

      updated = [newItem, ...cart];
    }

    saveCart(updated);

    showToast(
      `Added ${itemData.name} (${itemData.packSize}) to Cart!`,
      "success"
    );
  };

  const removeFromCart = (id: string) => {
    saveCart(cart.filter((item) => item.id !== id));
  };

  const updateCartQty = (
    id: string,
    delta: number
  ) => {
    const updated = cart
      .map((item) => {
        if (item.id !== id) return item;

        const newQty = item.quantity + delta;

        return newQty > 0
          ? { ...item, quantity: newQty }
          : null;
      })
      .filter((item): item is CartItem => item !== null);

    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartItemsCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const toggleWishlist = (colorId: string) => {
    let next: string[];

    if (wishlist.includes(colorId)) {
      next = wishlist.filter((id) => id !== colorId);
      showToast("Removed from saved shades", "info");
    } else {
      next = [...wishlist, colorId];
      showToast("Saved to your favorites!", "success");
    }

    setWishlist(next);

    try {
      localStorage.setItem(
        "colorhub_wishlist",
        JSON.stringify(next)
      );
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  };

  const isWishlisted = (colorId: string) =>
    wishlist.includes(colorId);

  const bookConsultation = (
    data: Omit<
      ConsultationInquiry,
      "id" | "createdAt" | "status"
    >
  ) => {
    const newInquiry: ConsultationInquiry = {
      ...data,
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split("T")[0],
      status: "New",
    };

    saveInquiries([newInquiry, ...inquiries]);

    showToast(
      "Consultation request booked! Our expert will call you shortly.",
      "success"
    );
  };

  const placeOrder = (customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }): Order | null => {
    if (cart.length === 0) return null;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      items: [...cart],
      totalAmount: cartTotal,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    };

    saveOrders([newOrder, ...orders]);
    clearCart();

    showToast(
      `Order #${newOrder.id} confirmed successfully!`,
      "success"
    );

    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: Order["status"]
  ) => {
    const updated = orders.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    );

    saveOrders(updated);

    showToast(
      `Order status updated to ${status}`,
      "info"
    );
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
        addBrand,
        deleteBrand,
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
    throw new Error(
      "useStore must be used within a StoreProvider"
    );
  }

  return context;
}
