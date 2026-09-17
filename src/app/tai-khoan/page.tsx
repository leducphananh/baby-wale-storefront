import { type Metadata } from "next";
import { AccountView } from "@/features/account/components/account-view";
import { Container } from "@/components/layout/container";
import { getAccountData } from "@/features/account/server/get-account-data";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
};

export default async function AccountPage() {
  const { user, profile, orders } = await getAccountData();

  if (!user) {
    redirect("/dang-nhap");
  }

  return (
    <Container>
      <AccountView
        email={user.email ?? ""}
        fullName={user.user_metadata?.full_name ?? "Khách hàng"}
        profile={profile}
        orders={orders}
      />
    </Container>
  );
}
