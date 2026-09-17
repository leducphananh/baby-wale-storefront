"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "../schema/auth";

export async function loginAction(data: LoginFormData) {
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
