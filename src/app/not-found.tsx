import Link from "next/link";

import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";

/** Foundation 404, restyled on the S2.4 design system (S2.5). */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col justify-center bg-bg py-16">
      <Container className="max-w-xl">
        <EmptyState
          titleAs="h1"
          title="Không tìm thấy trang"
          description="Trang bạn tìm không tồn tại hoặc đã được chuyển đi."
          action={
            <Button asChild variant="secondary">
              <Link href="/">Về trang chủ</Link>
            </Button>
          }
        />
      </Container>
    </main>
  );
}
