import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatVND } from '../data/products';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
  PhoneCall,
  MapPin,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { currentOrderId, orders, navigateTo } = useStore();

  const order =
    orders.find((o) => o.id === currentOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Không tìm thấy thông tin đơn hàng</h2>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div id="baby-wale-order-success" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-soft">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">
          Đặt Hàng Thành Công!
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Cảm ơn bạn đã tin tưởng lựa chọn Baby Wale. Chúng tôi đang chuẩn bị đơn hàng với sự cẩn trọng
          nhất dành cho bé yêu!
        </p>
      </div>

      {/* Order Main Card */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        {/* Order Meta Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-2">
          <div>
            <span className="text-xs text-muted-foreground">Mã đơn hàng:</span>
            <div className="text-base font-extrabold text-primary">#{order.orderCode}</div>
          </div>
          <div className="sm:text-right">
            <span className="text-xs text-muted-foreground">Ngày đặt hàng:</span>
            <div className="text-xs font-bold text-foreground">{order.createdAt}</div>
          </div>
        </div>

        {/* Order Status Badge */}
        <div className="p-4 rounded-2xl bg-pastel-pink/30 border border-pink-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-secondary flex items-center justify-center shrink-0 shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">
              Trạng thái đơn: <span className="text-primary">{order.statusText}</span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Nhân viên CSKH của Baby Wale sẽ liên hệ xác nhận đơn qua số điện thoại của bạn trước khi xuất kho.
            </p>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-1.5">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              Địa Chỉ Giao Hàng
            </h4>
            <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
            <p className="text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
            <p className="text-muted-foreground">
              {order.shippingAddress.streetAddress}, {order.shippingAddress.ward ? `${order.shippingAddress.ward}, ` : ''}
              {order.shippingAddress.district}, {order.shippingAddress.city}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/50 border border-border/80 space-y-1.5">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-primary" />
              Vận Chuyển & Thanh Toán
            </h4>
            <p>
              <strong className="text-foreground">Hình thức: </strong>
              <span className="text-muted-foreground">{order.shippingMethod}</span>
            </p>
            <p>
              <strong className="text-foreground">Thanh toán: </strong>
              <span className="text-muted-foreground">
                {order.paymentMethod === 'cod'
                  ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                  : order.paymentMethod === 'bank_transfer'
                  ? 'Chuyển khoản QR'
                  : order.paymentMethod.toUpperCase()}
              </span>
            </p>
            <p>
              <strong className="text-foreground">Trạng thái thanh toán: </strong>
              <span className="text-amber-600 font-bold">
                {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </p>
          </div>
        </div>

        {/* Purchased Items */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs sm:text-sm text-foreground">Sản Phẩm Đã Đặt</h4>
          <div className="space-y-2.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-white"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-contain bg-muted p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-foreground line-clamp-1">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-muted-foreground">
                      Số lượng: <strong>{item.quantity}</strong>
                      {item.selectedVariant && ` • ${item.selectedVariant}`}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-black text-primary">
                  {formatVND(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Price summary */}
        <div className="pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-bold text-foreground">{formatVND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí giao hàng:</span>
            <span className="font-bold text-foreground">
              {order.shippingFee === 0 ? 'Miễn phí' : formatVND(order.shippingFee)}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-secondary-foreground font-bold">
              <span>Mã giảm giá:</span>
              <span>-{formatVND(order.discountAmount)}</span>
            </div>
          )}
          <div className="pt-2 border-t border-border flex justify-between items-baseline text-foreground">
            <span className="font-extrabold text-sm">Tổng tiền:</span>
            <span className="text-xl font-black text-primary">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => navigateTo('order-detail', { orderId: order.id })}
          className="w-full sm:w-auto px-6 py-3 border border-primary text-primary font-bold text-xs rounded-xl hover:bg-primary/5 transition-colors"
        >
          Theo dõi đơn hàng chi tiết
        </button>
        <button
          onClick={() => navigateTo('shop')}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
};
