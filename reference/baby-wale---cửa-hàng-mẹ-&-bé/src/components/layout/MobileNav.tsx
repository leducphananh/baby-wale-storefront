import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Grid, ShoppingBag, Package, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, navigateTo, cartCount, currentUser } = useStore();

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, page: 'home' as const },
    { id: 'shop', label: 'Cửa hàng', icon: Grid, page: 'shop' as const },
    {
      id: 'cart',
      label: 'Giỏ hàng',
      icon: ShoppingBag,
      page: 'cart' as const,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    { id: 'orders', label: 'Đơn hàng', icon: Package, page: 'orders' as const },
    {
      id: 'account',
      label: currentUser ? 'Tài khoản' : 'Đăng nhập',
      icon: User,
      page: currentUser ? ('account' as const) : ('login' as const),
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Thanh điều hướng di động"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-2 py-1.5 shadow-lg flex items-center justify-around"
    >
      {navItems.map((item) => {
        const isActive =
          currentPage === item.page ||
          (item.id === 'orders' && currentPage === 'order-detail') ||
          (item.id === 'shop' && (currentPage === 'product-detail' || currentPage === 'search'));

        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.page)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <div className="relative">
              <IconComponent className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-black flex items-center justify-center leading-none shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] mt-1 tracking-tight leading-none ${
                isActive ? 'font-black text-primary' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
