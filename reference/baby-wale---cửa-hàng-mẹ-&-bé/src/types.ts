export type PageRoute = 
  | 'home'
  | 'shop'
  | 'product-detail'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'account'
  | 'orders'
  | 'order-detail'
  | 'about'
  | 'contact'
  | '404';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  itemCount: number;
  featured?: boolean;
}

export interface ProductSpecification {
  brand: string;
  origin: string;
  targetAge: string;
  packaging: string;
  materialOrIngredients: string;
  expiryOrWarranty?: string;
  safetyCertificates?: string[];
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  usageGuide?: string;
  specifications: ProductSpecification;
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  tags: string[];
  variants?: {
    name: string;
    options: string[];
  }[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';

export type PaymentMethod = 'cod' | 'bank_transfer' | 'vnpay' | 'momo';

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variant?: string;
  selectedVariant?: string;
  product: {
    id: string;
    name: string;
    thumbnail: string;
    price: number;
    specifications?: ProductSpecification;
  };
}

export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone?: string;
  phoneNumber: string;
  email?: string;
  province?: string;
  city: string;
  district: string;
  ward: string;
  addressDetail?: string;
  streetAddress: string;
  note?: string;
  notes?: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderCode: string;
  createdAt: string;
  status: OrderStatus;
  statusText: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  discountAmount: number;
  total: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo';
  paymentStatus: 'unpaid' | 'paid';
  trackingCode?: string;
  estimatedDeliveryDate?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  phoneNumber: string;
  avatar?: string;
  babyName?: string;
  babyBirthday?: string;
  walePoints: number;
  memberTier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  addresses: ShippingAddress[];
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}
