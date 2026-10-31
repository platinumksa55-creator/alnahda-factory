"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    name: "نظرة عامة",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "إدارة الموديلات",
    href: "/admin/products",
    icon: Layers,
    exact: false,
  },
  {
    name: "رسائل واستفسارات العملاء",
    href: "/admin/inquiries",
    icon: MessageSquare,
    exact: false,
  },
  {
    name: "تعليقات وتقييمات المنتجات",
    href: "/admin/comments",
    icon: MessageSquare,
    exact: false,
  },
  {
    name: "إحصائيات وعداد الزوار",
    href: "/admin/analytics",
    icon: BarChart3,
    exact: false,
  },
  {
    name: "الإعدادات والأمان",
    href: "/admin/settings",
    icon: Settings,
    exact: false,
  },
];

export function AdminNav({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error(e);
      setIsLoggingOut(false);
    }
  };

  const isActive = (itemHref: string, exact: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return pathname.startsWith(itemHref);
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Image
                  src="/images/al-nahda-logo.png"
                  alt="لوجو المصنع"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 leading-tight">لوحة تحكم مصنع النهضة</span>
                <span className="text-xs text-primary font-medium">إدارة الموديلات وإحصائيات الزوار</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/ar"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-primary bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>معاينة الموقع الرئيسي</span>
            </Link>

            <div className="flex items-center gap-2 pr-2 border-r border-slate-200">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                {username}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs sm:text-sm gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 right-0 bottom-0 z-30 w-64 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            القائمة الرئيسية
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-500"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <Link
            href="/ar"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>عرض المتجر للزوار</span>
          </Link>
          <div className="text-center text-[11px] text-slate-400">
            مصنع النهضة للمنسوجات © 2026
          </div>
        </div>
      </aside>
    </>
  );
}
