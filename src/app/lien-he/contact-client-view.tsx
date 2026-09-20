"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Building,
} from "lucide-react";
import { env } from "@/lib/env";

export function ContactClientView() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    subject: "Tư vấn sản phẩm",
    message: "",
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.fullName.trim() || !formData.phoneNumber.trim() || !formData.message.trim()) {
      setErrorMessage("Vui lòng điền họ tên, số điện thoại và nội dung cần nhắn");
      return;
    }

    setSuccessMessage("Gửi tin nhắn thành công! Chuyên viên tư vấn của Baby Wale sẽ liên hệ lại với bạn trong vòng 30 phút.");
    setFormData({
      fullName: "",
      phoneNumber: "",
      email: "",
      subject: "Tư vấn sản phẩm",
      message: "",
    });
  };

  const stores = [
    {
      name: "Baby Wale Flagship Store - Quận 1 (TP.HCM)",
      address: "120 Hai Bà Trưng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
      phone: "028 3822 8899",
      hours: "08:00 - 21:30 (Mở cửa cả T7 & CN)",
      features: ["Khu trải nghiệm bình sữa & máy tiệt trùng", "Chỗ đỗ xe ô tô miễn phí", "Tư vấn dinh dưỡng trực tiếp"],
    },
    {
      name: "Baby Wale Showroom - Cầu Giấy (Hà Nội)",
      address: "88 Trần Thái Tông, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
      phone: "024 3795 8899",
      hours: "08:00 - 21:30 (Mở cửa cả T7 & CN)",
      features: ["Đầy đủ size bỉm Merries & Moony nhập khẩu", "Giao hỏa tốc 2H nội thành Hà Nội"],
    },
    {
      name: "Baby Wale Boutique - Hải Châu (Đà Nẵng)",
      address: "45 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng",
      phone: "0236 388 8899",
      hours: "08:00 - 21:30 (Mở cửa cả T7 & CN)",
      features: ["Không gian thân thiện cho mẹ bỉm và bé", "Thanh toán không tiền mặt"],
    },
  ];

  const faqs = [
    {
      question: "Sản phẩm tại Baby Wale có thực sự chính hãng 100% không?",
      answer:
        "Tất cả sản phẩm tại Baby Wale đều được nhập khẩu chính ngạch, có tem phụ tiếng Việt, hóa đơn VAT và giấy chứng nhận kiểm định chất lượng an toàn từ cơ quan y tế. Chúng tôi cam kết đền bù 200% nếu quý khách phát hiện hàng không chính hãng.",
    },
    {
      question: "Chính sách đổi trả hàng như thế nào?",
      answer:
        "Baby Wale hỗ trợ đổi trả hàng miễn phí trong vòng 7 ngày kể từ khi nhận hàng đối với sản phẩm còn nguyên bao bì/tem mác, hoặc sản phẩm bị lỗi do nhà sản xuất/hư hỏng trong quá trình vận chuyển.",
    },
    {
      question: "Đơn hàng bao nhiêu thì được miễn phí vận chuyển?",
      answer:
        "Đơn hàng có giá trị tạm tính từ 499.000₫ trở lên sẽ được miễn phí giao hàng tiêu chuẩn trên phạm vi toàn quốc. Đối với giao hàng hỏa tốc nội thành 2H, mức phí phụ thu là 25.000₫.",
    },
    {
      question: "Tôi có thể kiểm tra hàng trước khi thanh toán không?",
      answer:
        "Hoàn toàn được. Với hình thức giao hàng thu tiền tận nơi (COD), quý khách được quyền mở hộp kiểm tra đúng mẫu mã, số lượng và nguyên vẹn sản phẩm trước khi thanh toán cho nhân viên bưu tá.",
    },
  ];

  return (
    <div id="baby-wale-contact-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-12 text-left">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link></li>
          <li className="flex items-center space-x-2">
            <span className="text-border">/</span>
            <span className="text-foreground font-semibold">Liên hệ & Cửa hàng</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
          Kết nối với chúng tôi
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground">
          Liên Hệ & Hệ Thống Showroom
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Đội ngũ tư vấn Baby Wale luôn sẵn sàng lắng nghe, giải đáp thắc mắc và hỗ trợ ba mẹ 7 ngày trong tuần.
        </p>
      </div>

      {/* Store Locations Grid */}
      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          Hệ Thống Cửa Hàng Baby Wale
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stores.map((store, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/80 rounded-3xl p-5 shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <h3 className="font-bold text-sm text-primary">{store.name}</h3>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-secondary shrink-0" />
                    <span className="font-bold text-foreground">{store.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span>{store.hours}</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60">
                  <span className="text-[11px] font-bold text-foreground block mb-1">
                    Tiện ích tại cửa hàng:
                  </span>
                  <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                    {store.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href={`tel:${store.phone.replace(/\s+/g, "")}`}
                  className="w-full py-2 bg-muted text-primary hover:bg-primary hover:text-primary-foreground font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Gọi cửa hàng
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Contact Form & Direct Support Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
          <h3 className="font-extrabold text-base text-foreground pb-2 border-b border-border flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Gửi Tin Nhắn Cho Baby Wale
          </h3>

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Họ và tên của ba/mẹ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="0912 345 678"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:border-ring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:border-ring"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Chủ đề cần tư vấn</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:border-ring"
                >
                  <option value="Tư vấn sản phẩm">Tư vấn chọn sản phẩm cho bé</option>
                  <option value="Hỗ trợ đơn hàng">Hỗ trợ tra cứu / sửa đơn hàng</option>
                  <option value="Đổi trả bảo hành">Yêu cầu đổi trả / bảo hành</option>
                  <option value="Hợp tác phân phối">Hợp tác kinh doanh & đại lý</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1">
                Nội dung tin nhắn <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Nhập nội dung bạn cần hỗ trợ..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-white focus:outline-none focus:border-ring resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Gửi tin nhắn
            </button>
          </form>
        </div>

        {/* Quick Contact Info Channels (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-soft space-y-4">
            <h3 className="font-extrabold text-base text-foreground pb-2 border-b border-border">
              Kênh Trợ Giúp Nhanh
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-muted/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-pastel-pink/50 text-secondary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tổng đài miễn cước</span>
                  <a href={`tel:${env.NEXT_PUBLIC_STORE_HOTLINE.replace(/\s+/g, "")}`} className="font-extrabold text-base text-primary hover:underline">
                    {env.NEXT_PUBLIC_STORE_HOTLINE}
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{env.NEXT_PUBLIC_STORE_HOURS}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-muted/60 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-info/40 text-accent flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Email Chăm sóc khách hàng</span>
                  <a href={`mailto:${env.NEXT_PUBLIC_STORE_EMAIL}`} className="font-bold text-foreground hover:underline">
                    {env.NEXT_PUBLIC_STORE_EMAIL}
                  </a>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Phản hồi trong vòng 2 giờ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions FAQ Accordion */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
          <p className="text-xs text-muted-foreground mt-1 block">
            Những thắc mắc phổ biến nhất của cha mẹ khi mua sắm tại Baby Wale.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-border rounded-2xl overflow-hidden transition-all bg-white"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-foreground flex items-center justify-between gap-4 hover:bg-muted/40 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/60 bg-muted/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
