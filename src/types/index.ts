export type PaintCategory = 'Interior' | 'Exterior' | 'Wall' | 'Wood' | 'Metal' | 'Texture';

export type PaintFinish = 'Matte' | 'Satin' | 'Gloss' | 'Texture' | 'Eggshell';

export type PaintBrand = 'Asian Paints' | 'Berger' | 'Dulux' | 'Nerolac' | 'JSW' | 'Indigo' | 'Other';

export interface PaintColor {
  id: string;
  name: string;
  code: string;
  brand: PaintBrand;
  hex: string;
  category: PaintCategory;
  finish: PaintFinish;
  pricePer4L: number;
  description: string;
  roomImage: string;
  wallMaskType?: 'living' | 'bedroom' | 'kitchen' | 'exterior';
  isPopular?: boolean;
  isNew?: boolean;
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface BrandInfo {
  id: string;
  name: PaintBrand;
  tagline: string;
  logoUrl: string;
  accentColor: string;
  shadesCount: number;
  popularSeries: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  roomType: 'Living Room' | 'Bedroom' | 'Kitchen' | 'Exterior' | 'Office' | 'Kids Room';
  palette: string[];
  paletteNames: string;
  imageUrl: string;
  primaryColorId: string;
  description: string;
}

export interface CartItem {
  id: string;
  colorId: string;
  name: string;
  code: string;
  brand: PaintBrand;
  hex: string;
  packSize: '1L' | '4L' | '10L' | '20L';
  quantity: number;
  price: number;
  roomImage: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  createdAt: string;
}

export interface ConsultationInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  propertyType: string;
  preferredDate: string;
  notes: string;
  createdAt: string;
  status: 'New' | 'Contacted' | 'Completed';
}
