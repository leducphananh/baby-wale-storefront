import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatVND } from '../../data/products';
import { Star, Heart, ShoppingBag, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist } = useStore();
  const isFavorited = isInWishlist(product.id);

  const handleCardClick = () => {
    navigateTo('product-detail', { productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className={`group relative bg-card border border-border/80 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:border-accent/40 transition-all duration-300 flex flex-col cursor-pointer ${className}`}
    >
      {/* Badges Overlay */}
      <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 pointer-events-none">
        {product.discountPercent && product.discountPercent > 0 ? (
          <span className="bg-secondary text-secondary-foreground font-extrabold text-[11px] px-2 py-0.5 rounded-md shadow-xs">
            -{product.discountPercent}%
          </span>
        ) : null}
        {product.isNew && (
          <span className="bg-accent text-accent-foreground font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
            MỚI
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-xs transition-all duration-200 ${
          isFavorited
            ? 'bg-secondary text-primary shadow-sm'
            : 'bg-white/80 text-muted-foreground hover:text-secondary hover:bg-white'
        }`}
        aria-label={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-muted flex items-center justify-center p-3">
        <img
          src={product.thumbnail}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {!product.inStock && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/95 text-foreground text-xs font-bold px-3 py-1.5 rounded-lg shadow">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category / Brand */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium mb-1">
            <span className="truncate max-w-[140px]">{product.specifications.brand}</span>
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 mr-0.5" />
              {product.rating}
              <span className="text-muted-foreground text-[10px] ml-0.5">({product.reviewCount})</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-foreground text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Quick Specification Highlight */}
          <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
            {product.specifications.targetAge} • {product.specifications.origin}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="mt-3 pt-2.5 border-t border-border/60">
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="font-extrabold text-sm sm:text-base text-primary">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 ${
              product.inStock
                ? 'bg-muted text-primary hover:bg-primary hover:text-primary-foreground active:scale-98'
                : 'bg-muted/60 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};
