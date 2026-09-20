"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  ShieldCheck,
  Truck,
  Package,
  LogOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useCartStore, selectCartCount } from '@/features/cart/store';
import { createClient } from '@/lib/supabase/client';

export function SiteHeaderClient({ categories, user }: { categories: any[]; user: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartStore(selectCartCount);

  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputValue.trim()) {
      setIsSearchFocused(false);
      router.push(`/san-pham?tu-khoa=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchInputValue(keyword);
    setIsSearchFocused(false);
    router.push(`/san-pham?tu-khoa=${encodeURIComponent(keyword)}`);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  const navigateTo = (path: string) => {
    setIsMobileMenuOpen(false);
    setIsCategoryMenuOpen(false);
    setIsUserMenuOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-pastel-pink">
              <Truck className="w-3.5 h-3.5 text-secondary" />
              Miễn phí giao hàng toàn quốc từ 499.000₫
            </span>
            <span className="flex items-center gap-1.5 text-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              100% Sản phẩm chính hãng nguồn gốc rõ ràng
            </span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/90">
            <button
              onClick={() => navigateTo('/tra-cuu-don-hang')}
              className="hover:text-secondary transition-colors"
            >
              Kiểm tra đơn hàng
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => navigateTo('/ve-chung-toi')}
              className="hover:text-secondary transition-colors"
            >
              Về Baby Wale
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => navigateTo('/lien-he')}
              className="hover:text-secondary transition-colors flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3 text-secondary" />
              Hotline: 1900 8899
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
          {/* Mobile Hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-primary hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black text-primary tracking-tight leading-none">
                Baby Wale
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm">
            <button
              onClick={() => navigateTo('/')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                pathname === '/'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Trang chủ
            </button>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryMenuRef}>
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/danh-muc')
                    ? 'text-primary bg-muted font-bold'
                    : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
                }`}
              >
                <span>Danh mục</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isCategoryMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isCategoryMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Sản phẩm cho bé
                  </div>
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => navigateTo(`/danh-muc/${cat.slug}`)}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-foreground hover:bg-muted/70 hover:text-primary flex items-center justify-between group transition-colors"
                    >
                      <span>{cat.name}</span>
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => navigateTo('/san-pham')}
                      className="w-full px-3.5 py-2 text-left text-xs font-bold text-primary hover:bg-pastel-pink/30 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-secondary" />
                      Xem toàn bộ cửa hàng
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('/san-pham')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                pathname === '/san-pham'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Cửa hàng
            </button>

            <button
              onClick={() => navigateTo('/ve-chung-toi')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                pathname === '/ve-chung-toi'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Về chúng tôi
            </button>

            <button
              onClick={() => navigateTo('/lien-he')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                pathname === '/lien-he'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Liên hệ
            </button>
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Tìm tã bỉm, sữa, bình Hegen,..."
                className="w-full pl-10 pr-10 py-2.5 bg-muted/70 hover:bg-muted focus:bg-white text-xs sm:text-sm text-foreground rounded-2xl border border-transparent focus:border-ring focus:outline-none transition-all placeholder:text-muted-foreground"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchInputValue && (
                <button
                  type="button"
                  onClick={() => setSearchInputValue('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Search Dropdown Panel */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-border p-3.5 z-50">
                {searchInputValue.trim() ? (
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground mb-2 flex items-center justify-between">
                      <span>Sản phẩm gợi ý</span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-primary hover:underline"
                      >
                        Xem tất cả kết quả
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-[11px] font-bold text-muted-foreground mb-2">
                      Tìm kiếm phổ biến cho bé
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {['Bỉm Merries', 'Bình sữa Hegen', 'Sữa Meiji', 'Cetaphil Baby', 'Máy Fatzbaby'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => handleQuickSearch(tag)}
                            className="text-xs bg-muted hover:bg-pastel-pink/50 text-foreground font-medium px-2.5 py-1 rounded-lg transition-colors"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-foreground hover:bg-muted transition-colors"
                aria-label="Tài khoản"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[11px] text-muted-foreground leading-tight">Xin chào,</span>
                  <span className="text-xs font-bold text-primary truncate max-w-[90px]">
                    {user ? "Thành viên" : "Tài khoản"}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => navigateTo('/tai-khoan')}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted rounded-lg flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Tài khoản của tôi
                      </button>

                      <button
                        onClick={() => navigateTo('/tra-cuu-don-hang')}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted rounded-lg flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-primary" />
                        Đơn hàng của tôi
                      </button>

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-rose-50 rounded-lg flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 space-y-2">
                      <p className="text-xs text-muted-foreground text-center mb-2">
                        Đăng nhập để theo dõi đơn hàng
                      </p>
                      <button
                        onClick={() => navigateTo('/dang-nhap')}
                        className="w-full py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl text-center hover:bg-primary/90"
                      >
                        Đăng nhập
                      </button>
                      <button
                        onClick={() => navigateTo('/dang-ky')}
                        className="w-full py-2 border border-border font-semibold text-xs rounded-xl text-center hover:bg-muted text-foreground"
                      >
                        Tạo tài khoản mới
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => {
                // Because QuickCartDrawer wraps the layout, we can trigger it or just route to cart.
                // We'll just route to cart for now.
                router.push('/gio-hang');
              }}
              className="relative p-2.5 sm:px-3.5 sm:py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
              aria-label="Mở giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline font-bold text-xs">Giỏ hàng</span>
              <span className="bg-secondary text-secondary-foreground font-black text-xs px-2 py-0.5 rounded-full shadow-xs">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-18 bg-white/98 z-50 p-5 overflow-y-auto flex flex-col justify-between border-t border-border">
          <div className="space-y-4">
            <div className="font-bold text-sm text-primary uppercase tracking-wider mb-2">
              Khám phá Baby Wale
            </div>

            <nav className="flex flex-col space-y-1 font-semibold text-sm">
              <button
                onClick={() => navigateTo('/')}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Trang chủ</span>
              </button>
              <button
                onClick={() => navigateTo('/san-pham')}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Tất cả sản phẩm</span>
              </button>
              <button
                onClick={() => navigateTo('/tra-cuu-don-hang')}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Tra cứu đơn hàng</span>
              </button>
              <button
                onClick={() => navigateTo('/ve-chung-toi')}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Về Baby Wale</span>
              </button>
              <button
                onClick={() => navigateTo('/lien-he')}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Liên hệ & Hệ thống cửa hàng</span>
              </button>
            </nav>

            <div className="pt-4 border-t border-border">
              <div className="font-bold text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Danh mục nổi bật
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat.categoryId}
                    onClick={() => navigateTo(`/danh-muc/${cat.slug}`)}
                    className="p-2.5 bg-muted/60 rounded-xl text-left text-xs font-semibold text-foreground hover:bg-pastel-pink/40"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-xs text-muted-foreground space-y-2">
            <p className="flex items-center gap-1.5 font-bold text-primary">
              <PhoneCall className="w-3.5 h-3.5 text-secondary" />
              Tổng đài tư vấn: 1900 8899 (8h00 - 21h30)
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Showroom: 120 Hai Bà Trưng, Quận 1, TP.HCM
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
