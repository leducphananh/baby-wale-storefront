import Link from "next/link";

/**
 * Foundation 404 — accessible and minimal. Final visual design comes with S2.
 */
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center gap-3 px-6 py-16">
      <h1 className="text-xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-sm opacity-70">
        Trang bạn tìm không tồn tại hoặc đã được chuyển đi.
      </p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Về trang chủ
      </Link>
    </main>
  );
}
