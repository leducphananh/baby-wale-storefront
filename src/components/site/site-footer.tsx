import * as React from "react";

import Link from "next/link";

import { Container } from "@/components/layout/container";

/**
 * Site footer — S2.4 approved factual trust copy (§15) only. No fabricated
 * phone number, address, Zalo ID, certification, or delivery/shipping
 * promise (CLAUDE.md §8/§15, public-data-contract). "Hỗ trợ" keeps the
 * literal `[OWNER CONTENT TBD]` marker from the frozen contract rather than
 * inventing a channel.
 */
function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <Container className="flex flex-col gap-8 py-10 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-h3 text-text">Baby Wale</span>
          <p className="text-body-sm max-w-sm text-text-muted">Cửa hàng mẹ &amp; bé.</p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label-role text-text">Mua sắm</span>
          <Link href="/san-pham" className="text-body-sm text-text-muted hover:text-primary">
            Sản phẩm
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-label-role text-text">Thông tin</span>
          <p className="text-body-sm text-text-muted">Thanh toán khi nhận hàng (COD) hoặc chuyển khoản</p>
          <p className="text-body-sm text-text-muted">Nhân viên xác nhận từng đơn trước khi xử lý</p>
          <p className="text-body-sm text-text-muted">Hỗ trợ: [OWNER CONTENT TBD]</p>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="py-4">
          <p className="text-caption text-text-muted">© {new Date().getFullYear()} Baby Wale</p>
        </Container>
      </div>
    </footer>
  );
}

export { SiteFooter };
