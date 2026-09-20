"use client";

import React, { useState } from 'react';
import { ProductCard } from '@/components/catalog/product-card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HomeTabsProps {
  bestSellers: any[];
  newProducts: any[];
  featuredProducts: any[];
  totalProductsCount: number;
}

export function HomeTabs({ bestSellers, newProducts, featuredProducts, totalProductsCount }: HomeTabsProps) {
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'featured'>('bestseller');

  const tabProducts =
    activeTab === 'bestseller'
      ? bestSellers
      : activeTab === 'new'
      ? newProducts
      : featuredProducts;

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-secondary uppercase tracking-wider">
            Tuyển chọn dành riêng cho bé
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Sản Phẩm Được Mẹ Tin Chọn
          </h2>
        </div>

        {/* Interactive Tabs */}
        <div className="flex items-center bg-muted p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('bestseller')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bestseller'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Bán chạy nhất
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'new'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mới về
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'featured'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Nổi bật
          </button>
        </div>
      </div>

      {/* Product Grid: 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {tabProducts.slice(0, 8).map((product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/san-pham"
          className="px-6 py-3 border border-border text-foreground font-bold text-xs sm:text-sm rounded-xl hover:bg-muted/70 hover:border-primary transition-all inline-flex items-center gap-2"
        >
          Xem tất cả {totalProductsCount > 0 ? totalProductsCount : ""} sản phẩm
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  );
}
