import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatVND } from '../data/products';
import { OrderStatus } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Package, ChevronRight, Clock, Truck, CheckCircle2, Search } from 'lucide-react';

export const MyOrdersPage: React.FC = () => {
  const { orders, navigateTo } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchOrderCode, setSearchOrderCode] = useState<string>('');

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus !== 'all' && ord.status !== filterStatus) return false;
    if (searchOrderCode.trim()) {
      return (
        ord.orderCode.toLowerCase().includes(searchOrderCode.toLowerCase().trim()) ||
        ord.shippingAddress.fullName.toLowerCase().includes(searchOrderCode.toLowerCase().trim()) ||
        ord.shippingAddress.phoneNumber.includes(searchOrderCode.trim())
      );
    }
    return true;
  });

  return (
    <div id="baby-wale-my-orders" className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Tài khoản', page: 'account' }, { label: 'Đơn hàng của tôi' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Đơn Hàng Của Tôi
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Theo dõi tiến trình xử lý và lịch sử các đơn hàng bạn đã đặt.
          </p>
        </div>

        {/* Quick search by order code or phone */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchOrderCode}
            onChange={(e) => setSearchOrderCode(e.target.value)}
            placeholder="Tra cứu mã BW-..."
            className="w-full pl-8 pr-3 py-2 text-xs bg-muted/60 rounded-xl border border-border focus:outline-none focus:border-ring"
          />
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'pending', label: 'Chờ xác nhận' },
          { id: 'processing', label: 'Đang xử lý' },
          { id: 'shipping', label: 'Đang giao hàng' },
          { id: 'delivered', label: 'Đã giao' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors shrink-0 ${
              filterStatus === tab.id
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-12 text-center space-y-4 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-pastel-pink/50 text-primary mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Không có đơn hàng nào</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Hiện không có đơn hàng nào phù hợp với điều kiện tìm kiếm của bạn.
          </p>
          <button
            onClick={() => navigateTo('shop')}
            className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
          >
            Khám phá sản phẩm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusColors: Record<OrderStatus, string> = {
              pending: 'bg-amber-100 text-amber-800 border-amber-200',
              confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
              processing: 'bg-sky-100 text-sky-800 border-sky-200',
              shipping: 'bg-indigo-100 text-indigo-800 border-indigo-200',
              delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
            };

            return (
              <div
                key={order.id}
                onClick={() => navigateTo('order-detail', { orderId: order.id })}
                className="bg-card border border-border/80 hover:border-primary/50 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all cursor-pointer space-y-3.5"
              >
                {/* Header: Code, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/60 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-primary">
                      #{order.orderCode}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Ngày đặt: {order.createdAt}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.statusText}
                  </span>
                </div>

                {/* Items preview */}
                <div className="space-y-2">
                  {order.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={it.product.thumbnail}
                          alt={it.product.name}
                          className="w-12 h-12 rounded-lg object-contain bg-muted p-1 border border-border/60 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h5 className="font-bold text-foreground line-clamp-1">
                            {it.product.name}
                          </h5>
                          <span className="text-[11px] text-muted-foreground">
                            Số lượng: {it.quantity} {it.selectedVariant ? `(${it.selectedVariant})` : ''}
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-foreground shrink-0 ml-2">
                        {formatVND(it.product.price * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Total & Action */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Tổng thanh toán: </span>
                    <span className="text-base font-black text-primary">
                      {formatVND(order.total)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-primary group">
                    <span>Xem chi tiết đơn hàng</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
