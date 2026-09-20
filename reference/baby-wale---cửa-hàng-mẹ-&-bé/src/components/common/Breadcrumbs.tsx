import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PageRoute } from '../../types';

interface BreadcrumbItem {
  label: string;
  page?: PageRoute;
  params?: { category?: string; productId?: string };
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { navigateTo } = useStore();

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs text-muted-foreground ${className}`}>
      <button
        onClick={() => navigateTo('home')}
        className="flex items-center hover:text-primary transition-colors gap-1 font-medium"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Trang chủ</span>
      </button>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-muted-foreground/60 shrink-0" />
            {isLast || !item.page ? (
              <span className="font-semibold text-primary truncate max-w-[200px] sm:max-w-[320px]">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => navigateTo(item.page!, item.params)}
                className="hover:text-primary transition-colors font-medium truncate max-w-[150px]"
              >
                {item.label}
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
};
