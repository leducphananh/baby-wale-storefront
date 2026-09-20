import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, formatVND } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  SlidersHorizontal,
  ArrowUpDown,
  X,
  RotateCcw,
  Check,
  Search,
  PackageOpen,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { selectedCategory, navigateTo } = useStore();

  // Filter states
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>(selectedCategory || 'all');
  const [priceRange, setPriceRange] = useState<number>(2000000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Origins extracted from products
  const availableOrigins = ['Nhật Bản', 'Singapore', 'Úc', 'Đức', 'Thái Lan', 'Hàn Quốc', 'Việt Nam', 'Hoa Kỳ'];
  const availableBrands = ['Merries', 'Hegen', 'Meiji', 'Cetaphil', 'Fatzbaby', 'Moony', 'Mamamy', 'Nappi', 'Microlife'];

  // Toggle helpers
  const toggleOrigin = (origin: string) => {
    setSelectedOrigins((prev) =>
      prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setActiveCategorySlug('all');
    setPriceRange(2000000);
    setOnlyInStock(false);
    setSelectedOrigins([]);
    setSelectedBrands([]);
    setSortBy('default');
    setLocalSearch('');
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category
      if (activeCategorySlug !== 'all' && p.category !== activeCategorySlug) {
        return false;
      }
      // Price
      if (p.price > priceRange) {
        return false;
      }
      // Stock
      if (onlyInStock && !p.inStock) {
        return false;
      }
      // Origin
      if (
        selectedOrigins.length > 0 &&
        !selectedOrigins.some((org) => p.specifications.origin.toLowerCase().includes(org.toLowerCase()))
      ) {
        return false;
      }
      // Brand
      if (
        selectedBrands.length > 0 &&
        !selectedBrands.some((b) => p.specifications.brand.toLowerCase().includes(b.toLowerCase()))
      ) {
        return false;
      }
      // Keyword
      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.specifications.brand.toLowerCase().includes(query);
        const matchesCategory = p.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'vi');
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // default
    });
  }, [
    activeCategorySlug,
    priceRange,
    onlyInStock,
    selectedOrigins,
    selectedBrands,
    sortBy,
    localSearch,
  ]);

  const activeCategoryObject = CATEGORIES.find((c) => c.slug === activeCategorySlug);

  const activeFilterCount =
    (activeCategorySlug !== 'all' ? 1 : 0) +
    (priceRange < 2000000 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    selectedOrigins.length +
    selectedBrands.length +
    (localSearch ? 1 : 0);

  return (
    <div id="baby-wale-shop-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Cửa hàng', page: 'shop' },
          ...(activeCategoryObject ? [{ label: activeCategoryObject.name }] : []),
        ]}
      />

      {/* Header Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {activeCategoryObject ? activeCategoryObject.name : 'Tất Cả Sản Phẩm'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            {activeCategoryObject
              ? activeCategoryObject.description
              : 'Trọn bộ sản phẩm mẹ & bé chính hãng, an toàn và cao cấp được tuyển chọn từ Baby Wale.'}
          </p>
        </div>

        {/* Sorting Dropdown & Mobile Filter Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden px-3.5 py-2 rounded-xl bg-card border border-border text-foreground font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-1.5 bg-card border border-border rounded-xl px-3 py-1.5 shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
              Sắp xếp:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-foreground bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="default">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="name-asc">Tên: A → Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Shop Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-card border border-border/80 p-5 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              Bộ Lọc Sản Phẩm
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-secondary hover:text-primary flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Xóa tất cả
              </button>
            )}
          </div>

          {/* Search within shop */}
          <div>
            <label className="text-xs font-bold text-foreground mb-1.5 block">
              Tìm kiếm trong cửa hàng
            </label>
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/60 rounded-xl border border-border focus:border-ring focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
              {localSearch && (
                <button
                  onClick={() => setLocalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-foreground mb-2">Danh Mục</h4>
            <div className="space-y-1">
              <button
                onClick={() => setActiveCategorySlug('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  activeCategorySlug === 'all'
                    ? 'bg-primary text-primary-foreground font-bold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <span>Tất cả</span>
                <span>{PRODUCTS.length}</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategorySlug(cat.slug)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    activeCategorySlug === cat.slug
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span>{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-foreground mb-2">
              <span>Mức Giá Tối Đa</span>
              <span className="text-primary">{formatVND(priceRange)}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={50000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>50.000₫</span>
              <span>2.000.000₫+</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-center gap-2 text-xs font-bold text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
              />
              <span>Chỉ hiện sản phẩm còn hàng</span>
            </label>
          </div>

          {/* Origin Filters */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-foreground mb-2">Xuất Xứ</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {availableOrigins.map((origin) => {
                const isChecked = selectedOrigins.includes(origin);
                return (
                  <label
                    key={origin}
                    className="flex items-center gap-2 text-xs text-foreground/80 hover:text-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOrigin(origin)}
                      className="w-3.5 h-3.5 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span>{origin}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Brand Filters */}
          <div className="pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-foreground mb-2">Thương Hiệu</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {availableBrands.map((brand) => {
                const isChecked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-xs text-foreground/80 hover:text-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleBrand(brand)}
                      className="w-3.5 h-3.5 rounded text-primary accent-primary cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Products Grid Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/60 rounded-xl border border-border/60 text-xs">
              <span className="font-bold text-muted-foreground text-[11px]">Đang lọc theo:</span>

              {activeCategorySlug !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg text-foreground font-semibold">
                  Danh mục: {activeCategoryObject?.name}
                  <button onClick={() => setActiveCategorySlug('all')} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {priceRange < 2000000 && (
                <span className="inline-flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg text-foreground font-semibold">
                  Dưới: {formatVND(priceRange)}
                  <button onClick={() => setPriceRange(2000000)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onlyInStock && (
                <span className="inline-flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg text-foreground font-semibold">
                  Chỉ còn hàng
                  <button onClick={() => setOnlyInStock(false)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedOrigins.map((org) => (
                <span
                  key={org}
                  className="inline-flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg text-foreground font-semibold"
                >
                  {org}
                  <button onClick={() => toggleOrigin(org)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 bg-white border border-border px-2.5 py-1 rounded-lg text-foreground font-semibold"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-secondary hover:text-primary underline ml-auto"
              >
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Product Count indicator */}
          <div className="text-xs text-muted-foreground">
            Hiển thị <strong className="text-foreground">{filteredProducts.length}</strong> sản phẩm phù hợp
          </div>

          {/* Grid or Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-4 shadow-soft">
              <div className="w-16 h-16 rounded-full bg-pastel-pink/50 text-secondary mx-auto flex items-center justify-center">
                <PackageOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Không tìm thấy sản phẩm nào
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Rất tiếc, chưa có sản phẩm nào phù hợp với bộ lọc bạn đã chọn. Hãy thử điều chỉnh lại mức giá hoặc tiêu chí khác nhé!
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-primary/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-5 flex flex-col justify-between shadow-2xl">
              <div className="overflow-y-auto space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    Bộ Lọc
                  </h3>
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2">Danh mục</h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => setActiveCategorySlug('all')}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium ${
                        activeCategorySlug === 'all'
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      Tất cả ({PRODUCTS.length})
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategorySlug(cat.slug)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium ${
                          activeCategorySlug === cat.slug
                            ? 'bg-primary text-primary-foreground font-bold'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Mức giá tối đa</span>
                    <span className="text-primary">{formatVND(priceRange)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={2000000}
                    step={50000}
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                {/* In stock */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="w-4 h-4 text-primary accent-primary"
                    />
                    <span>Chỉ sản phẩm còn hàng</span>
                  </label>
                </div>
              </div>

              {/* Mobile filter actions */}
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
                <button
                  onClick={handleResetFilters}
                  className="py-2.5 px-3 border border-border text-foreground font-bold text-xs rounded-xl"
                >
                  Xóa lọc
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="py-2.5 px-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
                >
                  Áp dụng ({filteredProducts.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
