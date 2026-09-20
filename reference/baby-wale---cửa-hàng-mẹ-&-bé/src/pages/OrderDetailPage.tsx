import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatVND } from '../data/products';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  PhoneCall,
  RotateCcw,
  ArrowLeft,
  Headphones,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { currentOrderId, orders, navigateTo } = useStore();

  const order =
    orders.find((o) => o.id === currentOrderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Không tìm thấy đơn hàng</h2>
        <button
          onClick={() => navigateTo('orders')}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
        >
          Quay lại danh sách đơn
        </button>
      </div>
    );
  }

  // Timeline steps
  const steps = [
    { title: 'Đặt hàng thành công', time: order.createdAt, done: true },
    {
      title: 'Baby Wale xác nhận',
      time: order.status !== 'pending' ? 'Đã xác nhận' : 'Đang xử lý',
      done: order.status !== 'pending',
    },
    {
      title: 'Đang vận chuyển',
      time: order.status === 'shipping' || order.status === 'delivered' ? 'Đang giao tới bạn' : 'Chờ lấy hàng',
      done: order.status === 'shipping' || order.status === 'delivered',
    },
    {
      title: 'Giao hàng thành công',
      time: order.status === 'delivered' ? 'Đã nhận hàng' : 'Dự kiến 1-2 ngày',
      done: order.status === 'delivered',
    },
  ];

  return (
    <div id="baby-wale-order-detail" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Đơn hàng', page: 'orders' },
          { label: `Chi tiết #${order.orderCode}` },
        ]}
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div>
          <button
            onClick={() => navigateTo('orders')}
            className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Quay lại đơn hàng của tôi
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Đơn Hàng #{order.orderCode}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Đặt ngày: {order.createdAt}</p>
        </div>

        <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-pastel-pink/50 text-primary self-start sm:self-auto border border-pink-200">
          {order.statusText}
        </span>
      </div>

      {/* Progress Timeline */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
        <h3 className="font-extrabold text-sm text-foreground">Tiến Trình Đơn Hàng</h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                  step.done
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-xs text-foreground leading-tight">{step.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-2">
          <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
            <MapPin className="w-4 h-4 text-primary" />
            Địa Chỉ Nhận Hàng
          </h4>
          <p className="font-bold text-foreground text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-muted-foreground">{order.shippingAddress.phoneNumber}</p>
          <p className="text-muted-foreground">
            {order.shippingAddress.streetAddress}, {order.shippingAddress.ward ? `${order.shippingAddress.ward}, ` : ''}
            {order.shippingAddress.district}, {order.shippingAddress.city}
          </p>
          {order.shippingAddress.notes && (
            <p className="text-[11px] text-muted-foreground bg-muted/60 p-2 rounded-xl mt-2 italic">
              "Ghi chú: {order.shippingAddress.notes}"
            </p>
          )}
        </div>

        <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-2">
          <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 pb-2 border-b border-border">
            <CreditCard className="w-4 h-4 text-primary" />
            Thanh Toán & Vận Chuyển
          </h4>
          <p>
            <strong className="text-foreground">Hình thức vận chuyển: </strong>
            <span className="text-muted-foreground">{order.shippingMethod}</span>
          </p>
          <p>
            <strong className="text-foreground">Phương thức thanh toán: </strong>
            <span className="text-muted-foreground">
              {order.paymentMethod === 'cod'
                ? 'Thanh toán tiền mặt khi nhận hàng (COD)'
                : order.paymentMethod === 'bank_transfer'
                ? 'Chuyển khoản QR ngân hàng'
                : order.paymentMethod.toUpperCase()}
            </span>
          </p>
          <p>
            <strong className="text-foreground">Trạng thái thanh toán: </strong>
            <span className="text-amber-700 font-bold">
              {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
          </p>
        </div>
      </div>

      {/* Items list in order */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
        <h4 className="font-extrabold text-sm text-foreground pb-2 border-b border-border">
          Danh Sách Sản Phẩm Trong Đơn
        </h4>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-border/80 bg-white"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.product.thumbnail}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-xl object-contain bg-muted p-1 border border-border shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5
                    className="text-xs sm:text-sm font-bold text-foreground hover:text-primary cursor-pointer"
                    onClick={() => navigateTo('product-detail', { productId: item.product.id })}
                  >
                    {item.product.name}
                  </h5>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Đơn giá: {formatVND(item.product.price)} • Số lượng: <strong>{item.quantity}</strong>
                    {item.selectedVariant && ` • Phân loại: ${item.selectedVariant}`}
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-black text-primary ml-2 shrink-0">
                {formatVND(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Cost Summary */}
        <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Tạm tính:</span>
            <span className="font-bold text-foreground">{formatVND(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển:</span>
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
            <span className="font-extrabold text-sm">Tổng tiền đã thanh toán / cần thanh toán:</span>
            <span className="text-xl font-black text-primary">{formatVND(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Customer Support Reassurance for this Order */}
      <div className="p-5 rounded-3xl bg-muted/60 border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-white text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Headphones className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h5 className="font-bold text-foreground">Cần hỗ trợ về đơn hàng này?</h5>
            <p className="text-muted-foreground">
              Nếu bạn muốn đổi địa chỉ, thay đổi thời gian giao hoặc khiếu nại, vui lòng liên hệ ngay
              tổng đài.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('contact')}
          className="px-4 py-2 bg-white border border-border text-foreground font-bold rounded-xl hover:bg-muted shrink-0 text-xs flex items-center gap-1.5"
        >
          <PhoneCall className="w-3.5 h-3.5 text-secondary" />
          Gọi hỗ trợ 1900 8899
        </button>
      </div>
    </div>
  );
};
