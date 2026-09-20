import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PageRoute, Product, CartItem, Order, UserProfile, ShippingAddress, ToastMessage, OrderStatus } from '../types';
import { PRODUCTS } from '../data/products';

interface NavigationParams {
  productId?: string;
  orderId?: string;
  category?: string;
  query?: string;
}

interface PlaceOrderParams {
  shippingAddress: ShippingAddress;
  paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo';
  shippingMethod?: string;
}

export interface StoreContextType {
  // Navigation
  currentPage: PageRoute;
  selectedProductId: string | null;
  selectedOrderId: string | null;
  currentOrderId: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  navigateTo: (page: PageRoute, params?: NavigationParams) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateQuantity: (cartItemId: string, deltaOrQuantity: number, isAbsolute?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  couponCode: string;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  subtotal: number;
  shippingFee: number;
  total: number;
  freeShippingThreshold: number;
  isQuickCartOpen: boolean;
  setIsQuickCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & Profile
  currentUser: UserProfile | null;
  login: (emailOrPhone: string, password?: string) => void;
  logout: () => void;
  register: (fullName: string, emailOrPhone: string, password?: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  saveAddress: (address: ShippingAddress) => void;

  // Orders
  orders: Order[];
  createOrder: (
    address: ShippingAddress,
    paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo',
    shippingMethodTitle?: string
  ) => Order;
  placeOrder: (params: PlaceOrderParams) => Order;
  cancelOrder: (orderId: string) => void;

  // Toast
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_USER: UserProfile = {
  id: 'usr-001',
  fullName: 'Lê Phan Anh',
  email: 'leducphananh@gmail.com',
  phone: '0988 123 456',
  phoneNumber: '0988 123 456',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  babyName: 'Bé Bắp (8 tháng tuổi)',
  babyBirthday: '15/01/2026',
  walePoints: 350,
  memberTier: 'Gold',
  addresses: [
    {
      id: 'addr-01',
      fullName: 'Lê Phan Anh',
      phone: '0988 123 456',
      phoneNumber: '0988 123 456',
      email: 'leducphananh@gmail.com',
      province: 'TP. Hồ Chí Minh',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      addressDetail: 'Số 45 Lê Duẩn, Tòa nhà Diamond Plaza',
      streetAddress: 'Số 45 Lê Duẩn, Tòa nhà Diamond Plaza',
      note: 'Giao giờ hành chính, gọi trước khi đến',
      notes: 'Giao giờ hành chính, gọi trước khi đến',
      isDefault: true,
    },
    {
      id: 'addr-02',
      fullName: 'Lê Phan Anh (Nhà riêng)',
      phone: '0988 123 456',
      phoneNumber: '0988 123 456',
      email: 'leducphananh@gmail.com',
      province: 'TP. Hồ Chí Minh',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận Bình Thạnh',
      ward: 'Phường 25',
      addressDetail: 'Căn hộ Landmark 81, 720A Điện Biên Phủ',
      streetAddress: 'Căn hộ Landmark 81, 720A Điện Biên Phủ',
      note: 'Gửi lễ tân nếu không có nhà',
      notes: 'Gửi lễ tân nếu không có nhà',
      isDefault: false,
    }
  ],
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'processing': return 'Đang xử lý';
    case 'shipping': return 'Đang giao hàng';
    case 'delivered': return 'Giao hàng thành công';
    case 'cancelled': return 'Đã hủy';
  }
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'BW-98214',
    orderCode: 'BW-98214',
    createdAt: '18/09/2026 14:30',
    status: 'shipping',
    statusText: 'Đang giao hàng',
    items: [
      {
        id: 'oi-01',
        productId: 'prod-001',
        productName: 'Tã dán Merries First Premium Siêu Cao Cấp Size S (4-8kg)',
        productImage: PRODUCTS[0].thumbnail,
        price: 385000,
        quantity: 2,
        variant: 'Size S (4-8kg)',
        selectedVariant: 'Size S (4-8kg)',
        product: {
          id: PRODUCTS[0].id,
          name: PRODUCTS[0].name,
          thumbnail: PRODUCTS[0].thumbnail,
          price: PRODUCTS[0].price,
          specifications: PRODUCTS[0].specifications,
        },
      },
      {
        id: 'oi-02',
        productId: 'prod-004',
        productName: 'Sữa Tắm Gội Dịu Nhẹ Cho Bé Cetaphil Baby 400ml',
        productImage: PRODUCTS[3].thumbnail,
        price: 245000,
        quantity: 1,
        product: {
          id: PRODUCTS[3].id,
          name: PRODUCTS[3].name,
          thumbnail: PRODUCTS[3].thumbnail,
          price: PRODUCTS[3].price,
          specifications: PRODUCTS[3].specifications,
        },
      },
    ],
    shippingAddress: INITIAL_USER.addresses[0],
    shippingMethod: 'Giao hàng tiêu chuẩn',
    subtotal: 1015000,
    shippingFee: 0,
    discount: 50000,
    discountAmount: 50000,
    total: 965000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    trackingCode: 'VNP-88392019',
    estimatedDeliveryDate: '21/09/2026',
  },
  {
    id: 'ord-100',
    orderNumber: 'BW-94102',
    orderCode: 'BW-94102',
    createdAt: '05/09/2026 09:15',
    status: 'delivered',
    statusText: 'Giao hàng thành công',
    items: [
      {
        id: 'oi-03',
        productId: 'prod-002',
        productName: 'Bình sữa Hegen PPSU Cổ Vuông Chống Sặc 240ml',
        productImage: PRODUCTS[1].thumbnail,
        price: 590000,
        quantity: 1,
        variant: '240ml (Núm M)',
        selectedVariant: '240ml (Núm M)',
        product: {
          id: PRODUCTS[1].id,
          name: PRODUCTS[1].name,
          thumbnail: PRODUCTS[1].thumbnail,
          price: PRODUCTS[1].price,
          specifications: PRODUCTS[1].specifications,
        },
      },
      {
        id: 'oi-04',
        productId: 'prod-011',
        productName: 'Khăn Ướt Em Bé Không Mùi Mamamy 100 tờ',
        productImage: PRODUCTS[10].thumbnail,
        price: 42000,
        quantity: 3,
        product: {
          id: PRODUCTS[10].id,
          name: PRODUCTS[10].name,
          thumbnail: PRODUCTS[10].thumbnail,
          price: PRODUCTS[10].price,
          specifications: PRODUCTS[10].specifications,
        },
      },
    ],
    shippingAddress: INITIAL_USER.addresses[1],
    shippingMethod: 'Giao hỏa tốc 2H',
    subtotal: 716000,
    shippingFee: 0,
    discount: 0,
    discountAmount: 0,
    total: 716000,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    trackingCode: 'GHN-7721849',
    estimatedDeliveryDate: '07/09/2026',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bw_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'ci-001',
        product: PRODUCTS[0],
        quantity: 1,
        selectedVariant: 'Size S (4-8kg)',
      },
      {
        id: 'ci-002',
        product: PRODUCTS[1],
        quantity: 1,
        selectedVariant: '240ml (Núm M)',
      }
    ];
  });

  const [isQuickCartOpen, setIsQuickCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bw_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return ['prod-002', 'prod-006'];
  });

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('bw_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER;
  });

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bw_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bw_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('bw_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('bw_user');
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  // Toast dispatch helper
  const addToast = (title: string, message?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, title, message, type, duration: 3200 };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation router
  const navigateTo = (page: PageRoute, params?: NavigationParams) => {
    if (params?.productId !== undefined) setSelectedProductId(params.productId);
    if (params?.orderId !== undefined) setSelectedOrderId(params.orderId);
    if (params?.category !== undefined) setSelectedCategory(params.category);
    if (params?.query !== undefined) setSearchQuery(params.query);

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );

      if (existingItemIndex > -1) {
        const updated = [...prevCart];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          id: `cart-${Date.now()}`,
          product,
          quantity,
          selectedVariant: variant || (product.variants ? product.variants[0].options[0] : undefined),
        };
        return [newItem, ...prevCart];
      }
    });

    addToast(
      'Đã thêm vào giỏ hàng!',
      `${product.name} (x${quantity})`,
      'success'
    );
    setIsQuickCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, value: number, isAbsolute = false) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = isAbsolute ? value : item.quantity + value;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    addToast('Đã xóa sản phẩm', 'Sản phẩm đã được gỡ khỏi giỏ hàng', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'BABYWALE50' || trimmed === 'CHAOXUAN50') {
      setCouponCode(trimmed);
      setCouponDiscount(50000);
      addToast('Áp dụng mã thành công!', 'Giảm ngay 50.000₫ cho đơn hàng', 'success');
      return true;
    } else if (trimmed === 'FREESHIP') {
      setCouponCode(trimmed);
      setCouponDiscount(30000);
      addToast('Mã miễn phí vận chuyển!', 'Giảm 30.000₫ phí giao hàng', 'success');
      return true;
    } else {
      addToast('Mã giảm giá không hợp lệ', 'Vui lòng thử mã "BABYWALE50" hoặc "FREESHIP"', 'error');
      return false;
    }
  };

  // Financial calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = 499000;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 30000;
  const total = Math.max(0, subtotal + shippingFee - couponDiscount);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Đã bỏ yêu thích', 'Sản phẩm đã được xóa khỏi danh sách yêu thích', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Đã lưu yêu thích', 'Sản phẩm đã được thêm vào danh sách yêu thích', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth operations
  const login = (emailOrPhone: string, _password?: string) => {
    const user: UserProfile = {
      ...INITIAL_USER,
      email: emailOrPhone.includes('@') ? emailOrPhone : 'mebe@babywale.vn',
      phone: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
      phoneNumber: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
    };
    setCurrentUser(user);
    addToast('Đăng nhập thành công', `Chào mừng ${user.fullName} đến với Baby Wale!`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Đã đăng xuất', 'Hẹn gặp lại bạn sớm tại Baby Wale', 'info');
    navigateTo('home');
  };

  const register = (fullName: string, emailOrPhone: string, _password?: string) => {
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@babywale.user`,
      phone: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
      phoneNumber: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      babyName: 'Bé yêu của gia đình',
      babyBirthday: '01/06/2026',
      walePoints: 100,
      memberTier: 'Bronze',
      addresses: [
        {
          id: `addr-${Date.now()}`,
          fullName,
          phone: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
          phoneNumber: emailOrPhone.includes('@') ? '0988 123 456' : emailOrPhone,
          email: emailOrPhone.includes('@') ? emailOrPhone : '',
          province: 'TP. Hồ Chí Minh',
          city: 'TP. Hồ Chí Minh',
          district: 'Quận 1',
          ward: 'Phường Bến Nghé',
          addressDetail: 'Địa chỉ nhận hàng',
          streetAddress: 'Địa chỉ nhận hàng',
          isDefault: true,
        }
      ],
    };
    setCurrentUser(newUser);
    addToast('Đăng ký tài khoản thành công', 'Chào mừng bạn đến với đại gia đình Baby Wale!', 'success');
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, ...data });
    addToast('Cập nhật thành công', 'Thông tin cá nhân đã được lưu', 'success');
  };

  const saveAddress = (newAddress: ShippingAddress) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      addresses: [newAddress, ...currentUser.addresses.filter(a => a.streetAddress !== newAddress.streetAddress)],
    });
    addToast('Đã lưu địa chỉ', 'Địa chỉ giao hàng đã được cập nhật', 'success');
  };

  // Orders
  const createOrder = (
    address: ShippingAddress,
    paymentMethod: 'cod' | 'bank_transfer' | 'vnpay' | 'momo',
    shippingMethodTitle = 'Giao hàng tiêu chuẩn'
  ): Order => {
    const orderNum = `BW-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      orderCode: orderNum,
      createdAt: formattedDate,
      status: 'pending',
      statusText: 'Chờ xác nhận',
      items: cart.map((item) => ({
        id: `oi-${Math.random()}`,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.thumbnail,
        price: item.product.price,
        quantity: item.quantity,
        variant: item.selectedVariant,
        selectedVariant: item.selectedVariant,
        product: {
          id: item.product.id,
          name: item.product.name,
          thumbnail: item.product.thumbnail,
          price: item.product.price,
          specifications: item.product.specifications,
        },
      })),
      shippingAddress: address,
      shippingMethod: shippingMethodTitle,
      subtotal,
      shippingFee,
      discount: couponDiscount,
      discountAmount: couponDiscount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      trackingCode: `BW-SHIP-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDeliveryDate: '2 - 3 ngày tới',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);
    addToast('Đặt hàng thành công!', `Mã đơn hàng: ${orderNum}`, 'success');
    return newOrder;
  };

  const placeOrder = (params: PlaceOrderParams): Order => {
    return createOrder(params.shippingAddress, params.paymentMethod, params.shippingMethod);
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'cancelled' as const, statusText: 'Đã hủy' }
          : o
      )
    );
    addToast('Đã hủy đơn hàng', 'Đơn hàng đã được chuyển sang trạng thái đã hủy', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        selectedProductId,
        selectedOrderId,
        currentOrderId: selectedOrderId,
        selectedCategory,
        searchQuery,
        navigateTo,

        cart,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        couponCode,
        couponDiscount,
        applyCoupon,
        subtotal,
        shippingFee,
        total,
        freeShippingThreshold,
        isQuickCartOpen,
        setIsQuickCartOpen,

        wishlist,
        toggleWishlist,
        isInWishlist,

        currentUser,
        login,
        logout,
        register,
        updateProfile,
        saveAddress,

        orders,
        createOrder,
        placeOrder,
        cancelOrder,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
