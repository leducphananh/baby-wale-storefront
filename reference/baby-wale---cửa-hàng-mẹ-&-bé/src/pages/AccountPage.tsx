import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  User,
  Package,
  MapPin,
  Heart,
  Award,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Baby,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    orders,
    wishlist,
    logout,
    navigateTo,
    addToast,
  } = useStore();

  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'baby'>('profile');

  // Address modal/form mock
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Vui lòng đăng nhập</h2>
        <p className="text-xs text-muted-foreground">
          Bạn cần đăng nhập để xem thông tin tài khoản và đơn hàng.
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim() || !newCity.trim()) {
      addToast('Thiếu thông tin', 'Vui lòng nhập địa chỉ cụ thể', 'warning');
      return;
    }
    currentUser.addresses.push({
      id: `addr-${Date.now()}`,
      fullName: currentUser.fullName,
      phoneNumber: newPhone || currentUser.phoneNumber,
      streetAddress: newStreet,
      ward: '',
      district: '',
      city: newCity,
      isDefault: false,
    });
    addToast('Đã lưu địa chỉ mới!', 'Địa chỉ đã được thêm vào danh bạ của bạn', 'success');
    setIsAddingAddress(false);
    setNewStreet('');
    setNewCity('');
  };

  return (
    <div id="baby-wale-account-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Tài khoản của tôi' }]} />

      <div className="pb-3 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Tài Khoản Ba Mẹ
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Quản lý thông tin gia đình, địa chỉ giao hàng và điểm tích lũy Wale Points.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="bg-card border border-border rounded-3xl p-5 shadow-soft space-y-4 text-center">
            <div className="w-20 h-20 rounded-full bg-pastel-pink/50 text-primary mx-auto flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.fullName} className="w-full h-full object-cover" />
              ) : (
                currentUser.fullName.charAt(0)
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-base text-foreground">{currentUser.fullName}</h3>
              <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              <p className="text-xs text-muted-foreground">{currentUser.phoneNumber}</p>
            </div>

            {/* Loyalty tier banner */}
            <div className="p-3 bg-pastel-pink/40 rounded-2xl border border-pink-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Award className="w-4 h-4 text-secondary" />
                <span>Hạng {currentUser.memberTier}</span>
              </div>
              <span className="font-extrabold text-primary">{currentUser.walePoints} điểm</span>
            </div>

            {/* Navigation tabs */}
            <div className="space-y-1 text-left pt-2 border-t border-border">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <User className="w-4 h-4" />
                Thông tin cá nhân
              </button>

              <button
                onClick={() => setActiveSection('addresses')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeSection === 'addresses'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Sổ địa chỉ ({currentUser.addresses.length})
              </button>

              <button
                onClick={() => setActiveSection('baby')}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                  activeSection === 'baby'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <Baby className="w-4 h-4" />
                Hồ sơ bé yêu
              </button>

              <button
                onClick={() => navigateTo('orders')}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Đơn hàng của tôi
                </span>
                <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Sản phẩm yêu thích
                </span>
                <span className="bg-muted px-2 py-0.5 rounded-full text-[10px]">
                  {wishlist.length}
                </span>
              </button>

              <div className="pt-2 border-t border-border">
                <button
                  onClick={logout}
                  className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 text-destructive hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: Profile info */}
          {activeSection === 'profile' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
              <h3 className="font-extrabold text-base text-foreground pb-2 border-b border-border">
                Thông Tin Cá Nhân
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Họ và tên</label>
                  <div className="p-3 rounded-xl bg-muted/60 font-bold text-foreground">
                    {currentUser.fullName}
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Số điện thoại</label>
                  <div className="p-3 rounded-xl bg-muted/60 font-bold text-foreground">
                    {currentUser.phoneNumber}
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Email</label>
                  <div className="p-3 rounded-xl bg-muted/60 font-bold text-foreground">
                    {currentUser.email}
                  </div>
                </div>
                <div>
                  <label className="text-muted-foreground font-semibold block mb-1">Hạng thành viên</label>
                  <div className="p-3 rounded-xl bg-pastel-pink/40 font-bold text-primary flex items-center justify-between">
                    <span>{currentUser.memberTier}</span>
                    <span>{currentUser.walePoints} điểm</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Tài khoản đã được bảo mật 2 lớp qua SMS OTP.
              </div>
            </div>
          )}

          {/* Section: Addresses */}
          {activeSection === 'addresses' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="font-extrabold text-base text-foreground">
                  Sổ Địa Chỉ Giao Hàng
                </h3>
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Thêm địa chỉ mới
                </button>
              </div>

              {isAddingAddress && (
                <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="font-bold text-xs text-foreground">Thêm địa chỉ giao hàng</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Số điện thoại nhận hàng"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="px-3 py-2 bg-white rounded-xl border border-border text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Tỉnh / Thành phố"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="px-3 py-2 bg-white rounded-xl border border-border text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Địa chỉ chi tiết (số nhà, ngõ, đường)"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 bg-white rounded-xl border border-border text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-3 py-1.5 border border-border text-xs font-bold rounded-xl"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-primary/90"
                    >
                      Lưu địa chỉ
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-border bg-white flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{addr.fullName}</span>
                        <span className="text-muted-foreground">({addr.phoneNumber})</span>
                        {addr.isDefault && (
                          <span className="bg-primary/10 text-primary font-bold text-[10px] px-2 py-0.5 rounded">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {addr.streetAddress}, {addr.ward ? `${addr.ward}, ` : ''}{addr.district}, {addr.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToast('Thông báo', 'Tính năng sửa địa chỉ đang phát triển', 'info')}
                        className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Baby profile */}
          {activeSection === 'baby' && (
            <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
              <h3 className="font-extrabold text-base text-foreground pb-2 border-b border-border">
                Hồ Sơ Của Bé Yêu
              </h3>
              <p className="text-xs text-muted-foreground">
                Baby Wale sẽ nhắc nhở thời điểm tăng size bỉm, đổi sữa công thức theo độ tuổi và gửi quà sinh nhật cho bé!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                  <span className="font-semibold text-muted-foreground">Tên bé:</span>
                  <div className="font-extrabold text-sm text-foreground">{currentUser.babyName || 'Bé Sữa'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-1 text-xs">
                  <span className="font-semibold text-muted-foreground">Ngày sinh / Dự sinh:</span>
                  <div className="font-extrabold text-sm text-foreground">
                    {currentUser.babyBirthday || '15/06/2024'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Quick Glimpse */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-extrabold text-base text-foreground">
                Đơn Hàng Gần Đây
              </h3>
              <button
                onClick={() => navigateTo('orders')}
                className="text-xs font-bold text-primary hover:underline"
              >
                Xem tất cả ({orders.length})
              </button>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                Bạn chưa có đơn hàng nào tại Baby Wale.
              </p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 2).map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => navigateTo('order-detail', { orderId: ord.id })}
                    className="p-3.5 rounded-2xl border border-border hover:border-primary/50 bg-white cursor-pointer transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-foreground">#{ord.orderCode}</div>
                      <div className="text-[11px] text-muted-foreground">{ord.createdAt}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-pastel-pink/40 text-primary">
                      {ord.statusText}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
