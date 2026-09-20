import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BabyWaleLogo } from '../components/common/BabyWaleLogo';
import { Lock, Mail, Phone, User, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';

export const AuthPages: React.FC = () => {
  const { currentPage, navigateTo, login, register, addToast } = useStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(
    currentPage === 'register' ? 'register' : 'login'
  );

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim() || !password.trim()) {
      addToast('Lỗi đăng nhập', 'Vui lòng nhập đầy đủ tài khoản và mật khẩu', 'warning');
      return;
    }
    login(emailOrPhone, password);
    navigateTo('account');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !emailOrPhone.trim() || !password.trim()) {
      addToast('Lỗi đăng ký', 'Vui lòng điền đủ các thông tin', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      addToast('Mật khẩu không khớp', 'Vui lòng kiểm tra lại mật khẩu xác nhận', 'warning');
      return;
    }
    if (!agreeTerms) {
      addToast('Điều khoản dịch vụ', 'Vui lòng đồng ý với điều khoản của Baby Wale', 'warning');
      return;
    }

    register(fullName, emailOrPhone, password);
    navigateTo('account');
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      addToast('Thông tin', 'Vui lòng nhập email hoặc số điện thoại của bạn', 'warning');
      return;
    }
    addToast(
      'Yêu cầu đã gửi',
      `Hướng dẫn khôi phục mật khẩu đã được gửi tới ${emailOrPhone}`,
      'success'
    );
    setMode('login');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 sm:py-16">
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <BabyWaleLogo size="md" className="justify-center" />
          <h2 className="text-xl font-extrabold text-foreground">
            {mode === 'login' && 'Chào mừng Ba Mẹ trở lại!'}
            {mode === 'register' && 'Đăng Ký Tài Khoản Baby Wale'}
            {mode === 'forgot' && 'Khôi Phục Mật Khẩu'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {mode === 'login' && 'Đăng nhập để theo dõi đơn hàng và nhận ưu đãi độc quyền'}
            {mode === 'register' && 'Tích điểm thành viên Wale Points và nhận quà sinh nhật cho bé'}
            {mode === 'forgot' && 'Nhập email hoặc số điện thoại để nhận mã xác nhận'}
          </p>
        </div>

        {/* Mode: Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Email hoặc Số điện thoại
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="name@example.com hoặc 0912..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-foreground">Mật khẩu</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-3.5 h-3.5 rounded text-primary accent-primary"
                />
                <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
              </label>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Đăng nhập
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials hint */}
            <div className="p-2.5 rounded-xl bg-muted/60 text-center text-[11px] text-muted-foreground">
              💡 Ba mẹ có thể nhấp <strong>Đăng nhập</strong> ngay để trải nghiệm tài khoản mẫu đã kích hoạt.
            </div>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              Chưa có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-primary font-bold hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Họ và tên của ba/mẹ
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Phương Anh"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Số điện thoại / Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="0912 345 678 hoặc email"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Xác nhận lại mật khẩu"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-primary accent-primary"
              />
              <span>
                Tôi đồng ý với{' '}
                <span className="text-primary font-semibold underline">Điều khoản sử dụng</span> và{' '}
                <span className="text-primary font-semibold underline">Chính sách bảo mật</span> của
                Baby Wale.
              </span>
            </label>

            <button
              id="register-submit-btn"
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm mt-2"
            >
              Tạo tài khoản mới
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-muted-foreground">
              Đã có tài khoản?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-primary font-bold hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        )}

        {/* Mode: Forgot */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Email hoặc Số điện thoại đã đăng ký
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Nhập email hoặc SĐT..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs focus:outline-none focus:border-ring"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all"
            >
              Gửi mã xác nhận
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-primary font-bold hover:underline"
              >
                Quay lại đăng nhập
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
