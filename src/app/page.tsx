import { Container } from "@/components/layout/container";

/**
 * S1/S2.5 foundation placeholder. Intentionally minimal — no hero, product
 * cards, categories, search, or commercial layout; those are S3+ (Public
 * Catalog Data Contract onward). This page only demonstrates that the S2.4
 * design tokens (typography, colour, container) compile and render — it is
 * not a designed screen.
 */
export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-bg py-16">
      <Container className="flex max-w-xl flex-col gap-3">
        <h1 className="text-h1 text-text">Baby Wale</h1>
        <p className="text-body text-text-muted">
          Nền tảng cửa hàng đang được xây dựng. Giao diện mua sắm (danh mục, sản phẩm,
          giỏ hàng, thanh toán) sẽ được xây dựng ở giai đoạn S3 trở đi, trên nền hệ
          thống thiết kế đã được duyệt (DESIGN APPROVED — Baby Wale Storefront V1).
        </p>
      </Container>
    </main>
  );
}
