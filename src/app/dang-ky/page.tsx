import { type Metadata } from "next";
import { RegisterView } from "@/features/auth/components/register-view";
import { Container } from "@/components/layout/container";

export const metadata: Metadata = {
  title: "Đăng ký",
};

export default function RegisterPage() {
  return (
    <Container>
      <RegisterView />
    </Container>
  );
}
