"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProductCard } from '@/components/catalog/product-card';
import { formatVnd } from '@/lib/format/money';
import { useCartStore } from '@/features/cart/store';
import { StorefrontProduct } from '@/features/catalog/types';

interface ProductDetailViewProps {
  product: StorefrontProduct;
  relatedProducts: any[];
  imageUrl: string | null;
}

export function ProductDetailView({ product, relatedProducts, imageUrl }: ProductDetailViewProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'usage' | 'policy'>('desc');
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Mocked for visual parity
  const isFavorited = false;
  const rating = 5;
  const reviewCount = 15;
  const images = imageUrl ? [imageUrl] : ["https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=600&q=80"];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addItem({
      productId: product.productId,
      slug: product.slug,
      name: product.name,
      unit: product.unit,
      cachedUnitPrice: product.sellingPrice,
      imageUrl: imageUrl,
      quantity: quantity,
    });
  };

  const handleBuyNow = () => {
    if (!product.inStock) return;
    handleAddToCart();
    router.push('/thanh-toan');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết!');
    }
  };

  return (
    <div id="baby-wale-product-detail" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            {product.categorySlug ? (
              <Link href={`/danh-muc/${product.categorySlug}`} className="hover:text-primary transition-colors">
                {product.categoryName}
              </Link>
            ) : (
              <span>Cửa hàng</span>
            )}
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold line-clamp-1">
              {product.name}
            </span>
          </li>
        </ol>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-border/80 p-6 flex items-center justify-center shadow-soft overflow-hidden group">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full h-full object-contain mix-blend-multiply cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
              onClick={() => setIsZoomModalOpen(true)}
              referrerPolicy="no-referrer"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              <span className="bg-primary text-primary-foreground font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                Bán chạy
              </span>
            </div>

            {/* Zoom Action Hint */}
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute bottom-4 right-4 p-2 rounded-xl bg-white/90 text-primary border border-border/80 shadow-xs hover:bg-white transition-colors"
              aria-label="Xem ảnh phóng to"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-2xl bg-white border-2 p-1.5 shrink-0 transition-all ${
                  activeImageIndex === idx
                    ? 'border-primary ring-2 ring-primary/20 scale-105 shadow-sm'
                    : 'border-border/80 hover:border-accent opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} - ảnh ${idx + 1}`}
                  className="w-full h-full object-contain mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

          {/* Reassurance strip under images */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 text-center">
            <div className="p-2.5 rounded-2xl bg-muted/60 text-[11px] font-semibold text-foreground flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span>Chính Hãng 100%</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-muted/60 text-[11px] font-semibold text-foreground flex flex-col items-center">
              <Truck className="w-4 h-4 text-accent mb-1" />
              <span>Giao Hỏa Tốc 2H</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-muted/60 text-[11px] font-semibold text-foreground flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-warning mb-1" />
              <span>Đổi Trả 7 Ngày</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Area */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Brand & Social Share */}
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-muted-foreground mb-2">
              <span className="text-primary font-bold uppercase tracking-wider bg-pastel-pink/40 px-2.5 py-0.5 rounded-md">
                {product.brand || 'Baby Wale'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
                  aria-label="Chia sẻ sản phẩm"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg hover:bg-muted transition-colors ${
                    isFavorited ? 'text-secondary' : 'text-muted-foreground hover:text-secondary'
                  }`}
                  aria-label="Yêu thích"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-snug">
              {product.name}
            </h1>

            {/* Rating & Review count */}
            <div className="flex items-center gap-3 mt-2.5 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400 mr-1" />
                <span>{rating}</span>
                <span className="text-muted-foreground font-normal ml-1">
                  ({reviewCount} đánh giá từ phụ huynh)
                </span>
              </div>
              <span className="text-border">|</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {product.inStock ? `Còn hàng` : 'Tạm hết hàng'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-primary">
              {formatVnd(product.sellingPrice)}
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.description || 'Đang cập nhật...'}
          </p>

          {/* Quantity & Purchase Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-foreground">Số lượng:</span>
              <div className="flex items-center border border-border rounded-xl bg-white shadow-xs overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-black text-foreground min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="p-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                id="add-to-cart-detail-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-3.5 px-4 rounded-2xl border-2 border-primary text-primary hover:bg-primary/5 font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                Thêm vào giỏ
              </button>

              <button
                id="buy-now-detail-btn"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-secondary fill-secondary" />
                Mua ngay
              </button>
            </div>
          </div>

          {/* Quick Specifications Summary */}
          <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <strong className="text-foreground font-semibold">Xuất xứ: </strong>
                {product.originCountry || 'Đang cập nhật'}
              </div>
              <div>
                <strong className="text-foreground font-semibold">Thương hiệu: </strong>
                {product.brand || 'Đang cập nhật'}
              </div>
              <div>
                <strong className="text-foreground font-semibold">Quy cách: </strong>
                {product.unit || 'Đang cập nhật'}
              </div>
              <div>
                <strong className="text-foreground font-semibold">Nhà sản xuất: </strong>
                {product.manufacturer || 'Đang cập nhật'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Detailed Information Tabs (Section 9) */}
      <section className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex border-b border-border gap-2 sm:gap-6 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'desc'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Mô Tả Chi Tiết
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'specs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Thông Số & Tiêu Chuẩn
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'usage'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Hướng Dẫn Sử Dụng
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
              activeTab === 'policy'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Chính Sách & Cam Kết
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-4xl">
              <p>{product.description || 'Chưa có mô tả chi tiết.'}</p>
              <div className="p-4 bg-muted/40 rounded-2xl border border-border space-y-2 mt-4">
                <h4 className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Đặc tính nổi bật:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Chất liệu tuyển chọn an toàn tuyệt đối với làn da và hệ miễn dịch non nớt của trẻ.</li>
                  <li>Sản phẩm nguyên seal nguyên hộp từ nhà sản xuất, hạn sử dụng luôn mới trên 18 tháng.</li>
                  <li>Được các chuyên gia nhi khoa khuyên dùng cho bé sơ sinh và trẻ nhỏ.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-3xl overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-xs sm:text-sm text-left">
                <tbody>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-3.5 font-bold text-foreground w-1/3">Thương hiệu</td>
                    <td className="p-3.5 text-muted-foreground">{product.brand || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3.5 font-bold text-foreground">Xuất xứ sản phẩm</td>
                    <td className="p-3.5 text-muted-foreground">{product.originCountry || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-3.5 font-bold text-foreground">Quy cách đóng gói</td>
                    <td className="p-3.5 text-muted-foreground">{product.unit || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3.5 font-bold text-foreground">Nhà sản xuất</td>
                    <td className="p-3.5 text-muted-foreground">{product.manufacturer || 'N/A'}</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/30">
                    <td className="p-3.5 font-bold text-foreground">Nhà phân phối</td>
                    <td className="p-3.5 text-muted-foreground">{product.distributor || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed max-w-3xl">
              <p>{'Sử dụng theo đúng hướng dẫn ghi trên bao bì từ nhà sản xuất.'}</p>
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                <h5 className="font-bold text-xs flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  Lưu ý bảo quản:
                </h5>
                <p className="text-xs">
                  Bảo quản nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp hoặc nguồn nhiệt cao. Để xa tầm tay của trẻ nhỏ khi không có người lớn giám sát.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                <h5 className="font-bold text-foreground">Cam kết 100% Chính Hãng</h5>
                <p className="text-muted-foreground">
                  Baby Wale cam kết bồi hoàn 200% giá trị đơn hàng nếu phát hiện sản phẩm giả mạo, không rõ nguồn gốc.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1.5">
                <h5 className="font-bold text-foreground">Đổi trả trong 7 ngày</h5>
                <p className="text-muted-foreground">
                  Hỗ trợ đổi mới ngay lập tức nếu sản phẩm gặp lỗi từ nhà sản xuất hoặc hư hại trong quá trình vận chuyển.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RELATED PRODUCTS (Section 10) */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Gợi ý cho bé
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground mt-0.5">
                Bạn Có Thể Thích
              </h2>
            </div>
            <Link
              href="/san-pham"
              className="text-xs sm:text-sm font-bold text-primary hover:underline"
            >
              Xem thêm
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Lightbox / Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-2xl w-full bg-white rounded-3xl p-6 shadow-2xl">
            <img
              src={images[activeImageIndex]}
              alt={product.name}
              className="w-full max-h-[75vh] object-contain mx-auto"
              referrerPolicy="no-referrer"
            />
            <p className="text-center text-xs text-muted-foreground mt-3">
              Nhấp vào bất kỳ đâu ngoài ảnh để đóng
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
