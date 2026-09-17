import { createClient } from "@/lib/supabase/server";
import { type Database } from "@/types/database";

export async function getAccountData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null, orders: [] };
  }

  // The RPCs are not in the generated types yet, so we use any
  const { data: profileData } = await supabase.rpc("get_storefront_customer_profile" as any);
  const { data: ordersData } = await supabase.rpc("get_storefront_customer_orders" as any);

  const profile = profileData?.[0] as Database["public"]["Tables"]["customers"]["Row"] | undefined;
  const orders = (ordersData ?? []) as Database["public"]["Tables"]["orders"]["Row"][];

  return {
    user,
    profile,
    orders,
  };
}
