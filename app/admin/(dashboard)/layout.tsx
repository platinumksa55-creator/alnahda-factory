import { redirect } from "next/navigation";
import { isAuthenticated, getAdminConfig } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const config = await getAdminConfig();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <AdminNav username={config.username} />
      <div className="flex-1 lg:pr-64 transition-all">
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
