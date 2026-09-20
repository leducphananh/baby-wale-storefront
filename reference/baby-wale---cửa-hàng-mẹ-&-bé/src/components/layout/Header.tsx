import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { PRODUCTS } from '../../data/products';
import { BabyWaleLogo } from '../common/BabyWaleLogo';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
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

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    cartCount,
    setIsQuickCartOpen,
    currentUser,
    logout,
    wishlist,
  } = useStore();

  const [searchInputValue, setSearchInputValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
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
      navigateTo('search', { query: searchInputValue.trim() });
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchInputValue(keyword);
    setIsSearchFocused(false);
    navigateTo('search', { query: keyword });
  };

  // Filter products for live preview
  const searchResultsPreview = searchInputValue.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchInputValue.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchInputValue.toLowerCase()) ||
        p.specifications.brand.toLowerCase().includes(searchInputValue.toLowerCase())
      ).slice(0, 4)
    : [];

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
              onClick={() => navigateTo('orders')}
              className="hover:text-secondary transition-colors"
            >
              Kiểm tra đơn hàng
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => navigateTo('about')}
              className="hover:text-secondary transition-colors"
            >
              Về Baby Wale
            </button>
            <span className="text-white/30">|</span>
            <button
              onClick={() => navigateTo('contact')}
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

            <BabyWaleLogo
              size="md"
              onClick={() => navigateTo('home')}
              className="cursor-pointer"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-semibold text-sm">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                currentPage === 'home'
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
                  currentPage === 'shop'
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
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setIsCategoryMenuOpen(false);
                        navigateTo('shop', { category: cat.slug });
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-foreground hover:bg-muted/70 hover:text-primary flex items-center justify-between group transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground group-hover:text-primary">
                        {cat.itemCount} sp
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsCategoryMenuOpen(false);
                        navigateTo('shop');
                      }}
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
              onClick={() => navigateTo('shop')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                currentPage === 'shop'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Cửa hàng
            </button>

            <button
              onClick={() => navigateTo('about')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                currentPage === 'about'
                  ? 'text-primary bg-muted font-bold'
                  : 'text-foreground/80 hover:text-primary hover:bg-muted/60'
              }`}
            >
              Về chúng tôi
            </button>

            <button
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                currentPage === 'contact'
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

                    {searchResultsPreview.length === 0 ? (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        Không có sản phẩm nào cho "{searchInputValue}"
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {searchResultsPreview.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setIsSearchFocused(false);
                              navigateTo('product-detail', { productId: item.id });
                            }}
                            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                          >
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover bg-muted shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-bold text-foreground truncate">
                                {item.name}
                              </h5>
                              <span className="text-[11px] font-extrabold text-primary">
                                {new Intl.NumberFormat('vi-VN').format(item.price)} ₫
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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

          {/* Right Action Icons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Link */}
            <button
              onClick={() => navigateTo('shop')}
              className="relative p-2 rounded-xl text-foreground hover:bg-muted transition-colors hidden sm:flex items-center justify-center"
              aria-label="Danh sách yêu thích"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-foreground hover:bg-muted transition-colors"
                aria-label="Tài khoản"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-primary font-bold overflow-hidden border border-border">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[11px] text-muted-foreground leading-tight">Xin chào,</span>
                  <span className="text-xs font-bold text-primary truncate max-w-[90px]">
                    {currentUser ? currentUser.fullName.split(' ').pop() : 'Tài khoản'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-border p-2 z-50 animate-in fade-in slide-in-from-top-2">
                  {currentUser ? (
                    <>
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs font-bold text-foreground">{currentUser.fullName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {currentUser.email}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] bg-pastel-pink/40 px-2 py-0.5 rounded-md font-semibold text-primary">
                          <span>Hạng: {currentUser.memberTier}</span>
                          <span>{currentUser.walePoints} điểm</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('account');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted rounded-lg flex items-center gap-2"
                      >
                        <User className="w-4 h-4 text-primary" />
                        Tài khoản của tôi
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('orders');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-foreground hover:bg-muted rounded-lg flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-primary" />
                        Đơn hàng của tôi
                      </button>

                      <div className="border-t border-border mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
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
                        Đăng nhập để tích điểm và theo dõi đơn hàng
                      </p>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('login');
                        }}
                        className="w-full py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl text-center hover:bg-primary/90"
                      >
                        Đăng nhập
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('register');
                        }}
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
              id="header-cart-btn"
              onClick={() => setIsQuickCartOpen(true)}
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
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('home');
                }}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Trang chủ</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('shop');
                }}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Tất cả sản phẩm</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('orders');
                }}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Tra cứu đơn hàng</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('about');
                }}
                className="p-3 text-left hover:bg-muted rounded-xl text-foreground flex items-center justify-between"
              >
                <span>Về Baby Wale</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('contact');
                }}
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
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('shop', { category: cat.slug });
                    }}
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
};
