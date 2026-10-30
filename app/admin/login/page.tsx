import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/login-form";

export const metadata = {
  title: "تسجيل الدخول | لوحة التحكم",
};

export default async function LoginPage() {
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-slate-50 to-neutral-100">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
