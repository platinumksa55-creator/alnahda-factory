import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: "لوحة التحكم | مصنع النهضة للمنسوجات",
  description: "لوحة تحكم إدارة الموديلات وإحصائيات الزوار",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased bg-slate-50 text-slate-800 min-h-screen">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
