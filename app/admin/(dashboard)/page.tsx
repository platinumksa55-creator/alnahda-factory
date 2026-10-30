import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Eye,
  Layers,
  TrendingUp,
  Plus,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  ArrowUpRight,
  Clock,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnalyticsSummary } from "@/lib/analytics-store";
import { getRawProducts } from "@/lib/products-store";
import { getInquiries } from "@/lib/inquiries-store";
import { AnalyticsChart } from "@/components/admin/analytics-chart";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "نظرة عامة | لوحة التحكم",
};

export default async function AdminDashboardPage() {
  const stats = await getAnalyticsSummary();
  const products = await getRawProducts();
  const inquiries = await getInquiries();
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;

  const totalProducts = products.length;
  const featuredProducts = products.filter((p) => p.featured).length;
  const recentProducts = products.slice(0, 5);

  const totalDeviceViews =
    stats.devices.desktop + stats.devices.mobile + stats.devices.tablet || 1;
  const mobilePercent = Math.round((stats.devices.mobile / totalDeviceViews) * 100);
  const desktopPercent = Math.round((stats.devices.desktop / totalDeviceViews) * 100);
  const tabletPercent = Math.round((stats.devices.tablet / totalDeviceViews) * 100);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-primary to-slate-800 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>لوحة الإدارة والتحكم الشاملة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            مرحباً بك في لوحة تحكم مصنع النهضة
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            من هنا يمكنك إضافة وإدارة موديلات المصنع، تعديل تفاصيلها وتعريفها، ومتابعة حركة وزيارات الموقع لحظة بلحظة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="bg-white hover:bg-slate-100 text-slate-900 font-semibold shadow-md">
            <Link href="/admin/products" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              <span>إضافة موديل جديد</span>
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
            <Link href="/ar" target="_blank" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              <span>معاينة الموقع</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {/* Today's Visitors */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              زوار اليوم
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.todayVisits}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">+{stats.todayUnique} زائر فريد</span>
              <span>خلال اليوم</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Visits */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              إجمالي زيارات الموقع
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalVisits}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-teal-700 font-semibold">{stats.uniqueVisitors} زائر إجمالي</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Models */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              الموديلات المعروضة
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalProducts}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-purple-600 font-semibold">{featuredProducts} موديل مميز</span>
            </p>
          </CardContent>
        </Card>

        {/* Customer Inquiries */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              رسائل العملاء
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{inquiries.length}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center justify-between">
              <span className="text-rose-600 font-semibold">{newInquiriesCount} رسالة جديدة</span>
              <Link href="/admin/inquiries" className="text-primary hover:underline">
                عرض
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card className="border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              زيارات هذا الأسبوع
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.weeklyVisits}</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-amber-600 font-semibold">{stats.monthlyVisits} هذا الشهر</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visitors Chart */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                حركة ونشاط الزوار
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                تطور عدد المشاهدات والزوار اليوميين للموقع
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-primary gap-1">
              <Link href="/admin/analytics">
                <span>عرض التفاصيل الكاملة</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <AnalyticsChart data={stats.chartDays} />
          </CardContent>
        </Card>

        {/* Devices & Top Pages Card */}
        <Card className="border-slate-200/80 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              أجهزة الزوار الأكثر استخداماً
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              نسبة الزوار حسب نوع الجهاز
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Device Bars */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    هواتف ذكية (Mobile)
                  </span>
                  <span className="font-bold text-slate-800">{mobilePercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${mobilePercent}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    أجهزة كمبيوتر (Desktop)
                  </span>
                  <span className="font-bold text-slate-800">{desktopPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${desktopPercent}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Tablet className="w-3.5 h-3.5 text-amber-600" />
                    أجهزة لوحية (Tablet)
                  </span>
                  <span className="font-bold text-slate-800">{tabletPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${tabletPercent}%` }} />
                </div>
              </div>
            </div>

            {/* Top 3 Pages */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-700">الصفحات الأكثر زيارة:</h4>
              <div className="space-y-2">
                {stats.topPages.slice(0, 3).map((page) => (
                  <div key={page.path} className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 truncate max-w-[180px] font-medium" title={page.path}>
                      {page.title}
                    </span>
                    <Badge variant="secondary" className="text-[11px] px-2 py-0.5">
                      {page.views} مشاهدة
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Models & Recent Visits Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Models */}
        <Card className="lg:col-span-2 border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                أحدث موديلات المصنع
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                الموديلات المعروضة حالياً على الموقع
              </p>
            </div>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/95 text-white text-xs gap-1.5">
              <Link href="/admin/products">
                <Plus className="w-3.5 h-3.5" />
                <span>إدارة جميع الموديلات</span>
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <Image
                        src={product.images[0] || "/images/luxury-cotton-fabric.png"}
                        alt={product.name.ar}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900 text-sm truncate">
                          {product.name.ar}
                        </h4>
                        {product.featured && (
                          <Badge className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 border-amber-200">
                            مميز
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-sm mt-0.5">
                        {product.category.ar} • {product.availability.ar}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button asChild variant="outline" size="sm" className="text-xs h-8">
                      <Link href={`/ar/products/${product.slug}`} target="_blank">
                        <Eye className="w-3.5 h-3.5 ml-1" />
                        <span>معاينة</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="text-xs h-8 bg-slate-800 hover:bg-slate-900 text-white">
                      <Link href={`/admin/products?edit=${product.id}`}>
                        <span>تعديل</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Realtime Live Recent Visits */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>سجل الزيارات اللحظية</span>
              </CardTitle>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              آخر الزوار الذين تصفحوا الموقع
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {stats.recentVisits.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  لا توجد زيارات مسجلة حديثاً
                </div>
              ) : (
                stats.recentVisits.slice(0, 7).map((visit) => {
                  const date = new Date(visit.timestamp);
                  const timeStr = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

                  return (
                    <div key={visit.id} className="p-3.5 hover:bg-slate-50 transition-colors text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 truncate max-w-[160px]" dir="ltr">
                          {visit.path}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeStr}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>{visit.device === "mobile" ? "هاتف محمول" : "كمبيوتر"} • {visit.browser}</span>
                        <span className="text-slate-400 truncate max-w-[100px]">{visit.referrer}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
