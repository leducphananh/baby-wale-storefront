import React from 'react';
import { useStore } from '../context/StoreContext';
import { BabyWaleLogo } from '../components/common/BabyWaleLogo';
import { Home, Grid, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigateTo } = useStore();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
      <div className="flex justify-center mb-2">
        <BabyWaleLogo size="lg" showText={false} />
      </div>

      <div className="space-y-2">
        <span className="text-4xl sm:text-6xl font-black text-secondary tracking-tight">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Không Tìm Thấy Trang
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Trang bạn đang tìm kiếm có thể đã được đổi tên, chuyển đi hoặc không tồn tại.
          Bé cá voi con Baby Wale sẽ dẫn bạn trở lại nhé!
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 shadow-sm"
        >
          <Home className="w-4 h-4" />
          Trở về trang chủ
        </button>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-white border border-border text-foreground font-bold text-xs rounded-xl hover:bg-muted transition-all inline-flex items-center gap-1.5"
        >
          <Grid className="w-4 h-4" />
          Khám phá cửa hàng
        </button>
      </div>
    </div>
  );
};
