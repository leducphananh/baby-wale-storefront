"use client";

import { useTransition } from "react";
import Link from "next/link";
import { LogOut, Package, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/server/actions";
import { formatVnd } from "@/lib/format/money";
import type { Database } from "@/types/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];

interface AccountViewProps {
  email: string;
  fullName: string;
  profile: CustomerRow | null;
  orders: OrderRow[];
}

export function AccountView({ email, fullName, profile, orders }: AccountViewProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 py-10 lg:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Tài khoản của tôi
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Xin chào, <span className="font-medium text-neutral-900">{fullName}</span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Thông tin tài khoản */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-4 text-lg font-semibold">
              <User className="h-5 w-5 text-primary-600" />
              Thông tin cá nhân
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="block text-neutral-500">Họ tên</span>
                <span className="font-medium text-neutral-900">{fullName}</span>
              </div>
              <div>
                <span className="block text-neutral-500">Email</span>
                <span className="font-medium text-neutral-900">{email}</span>
              </div>
              {profile?.phone && (
                <div>
                  <span className="block text-neutral-500">Số điện thoại</span>
                  <span className="font-medium text-neutral-900">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lịch sử đơn hàng */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2 border-b border-neutral-100 pb-4 text-lg font-semibold">
              <Package className="h-5 w-5 text-primary-600" />
              Lịch sử đơn hàng
            </div>

            {orders.length === 0 ? (
              <div className="py-8 text-center text-sm text-neutral-500">
                Bạn chưa có đơn hàng nào.
                <div className="mt-4">
                  <Button asChild variant="outline">
                    <Link href="/san-pham">Bắt đầu mua sắm</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 rounded-lg border border-neutral-100 bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-medium text-neutral-900">
                        Đơn hàng #{order.order_number}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        {new Date(order.created_at || "").toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                      <div className="font-semibold text-primary-600">
                        {formatVnd(order.total)}
                      </div>
                      <div className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700">
                        {order.status === "completed"
                          ? "Đã hoàn thành"
                          : order.status === "cancelled"
                            ? "Đã huỷ"
                            : "Đang xử lý"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
