import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, formatVND } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Search, PackageSearch, ArrowUpDown, ArrowLeft } from 'lucide-react';

export const SearchResultsPage: React.FC = () => {
  const { searchQuery, navigateTo } = useStore();
  const [sortBy, setSortBy] = useState<string>('default');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      const matchName = p.name.toLowerCase().includes(query);
      const matchCategory = p.categoryName.toLowerCase().includes(query);
      const matchBrand = p.specifications.brand.toLowerCase().includes(query);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(query));
      return matchName || matchCategory || matchBrand || matchTags;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name, 'vi');
      return 0;
    });
  }, [searchQuery, sortBy]);

  return (
    <div id="baby-wale-search-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Tìm kiếm', page: 'shop' }, { label: `"${searchQuery}"` }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Kết quả tìm kiếm cho: <span className="text-primary">"{searchQuery}"</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Tìm thấy <strong className="text-foreground">{searchResults.length}</strong> sản phẩm phù hợp
          </p>
        </div>

        {searchResults.length > 0 && (
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-1.5 shadow-xs self-start sm:self-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-foreground bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="default">Phù hợp nhất</option>
              <option value="price-asc">Giá thấp → cao</option>
              <option value="price-desc">Giá cao → thấp</option>
              <option value="name-asc">Tên A → Z</option>
            </select>
          </div>
        )}
      </div>

      {/* Results or Empty state */}
      {searchResults.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-10 sm:p-16 text-center space-y-4 shadow-soft max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-pastel-pink/50 text-primary mx-auto flex items-center justify-center">
            <PackageSearch className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Chúng tôi không tìm thấy kết quả nào cho từ khóa <strong>"{searchQuery}"</strong>. 
            Bạn hãy thử kiểm tra lại chính tả hoặc tham khảo các từ khóa gợi ý bên dưới nhé!
          </p>

          {/* Suggested keywords */}
          <div className="pt-2">
            <span className="text-xs font-bold text-foreground block mb-2">Gợi ý tìm kiếm:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {['Bỉm Merries', 'Bình sữa Hegen', 'Sữa Meiji', 'Cetaphil Baby', 'Mamamy', 'Bỉm Moony'].map(
                (term) => (
                  <button
                    key={term}
                    onClick={() => navigateTo('search', { query: term })}
                    className="px-3 py-1.5 rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground text-xs font-semibold transition-colors"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigateTo('shop')}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
