"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "../schema/auth";

export async function loginAction(data: LoginFormData) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = rateLimit(`login_${ip}`, 10, 60000); // 10 attempts per minute per IP

  if (!success) {
    return { error: "Bạn thử đăng nhập quá nhiều lần. Vui lòng thử lại sau giây lát." };
  }

  const result = loginSchema.safeParse(data);
  if (!result.success) {
    return { error: "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: "Email hoặc mật khẩu không chính xác" };
  }

  revalidatePath("/", "layout");
  redirect("/tai-khoan");
}

export async function registerAction(data: RegisterFormData) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for") ?? "127.0.0.1";
  const { success } = rateLimit(`register_${ip}`, 5, 60000); // 5 attempts per minute per IP

  if (!success) {
    return { error: "Bạn thao tác quá nhanh. Vui lòng thử lại sau giây lát." };
  }

  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return { error: "Dữ liệu không hợp lệ" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  });

  if (error) {
    return { error: "Đã xảy ra lỗi khi tạo tài khoản. Hoặc email đã tồn tại." };
  }

  revalidatePath("/", "layout");
  redirect("/tai-khoan");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
