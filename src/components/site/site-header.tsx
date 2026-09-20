import * as React from "react";
import { createClient } from "@/lib/supabase/server";
import { listStorefrontCategories } from "@/features/catalog/server/list-categories";
import { SiteHeaderClient } from "./site-header-client";

async function SiteHeader() {
  const categories = await listStorefrontCategories();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <SiteHeaderClient categories={categories} user={user} />;
}

export { SiteHeader };
