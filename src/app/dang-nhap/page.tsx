import { type Metadata } from "next";
import { LoginView } from "@/features/auth/components/login-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function LoginPage() {
  return (
    <Container>
      <LoginView />
    </Container>
  );
}
