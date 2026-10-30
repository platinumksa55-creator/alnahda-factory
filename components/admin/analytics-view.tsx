"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Eye,
  Calendar,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  RefreshCw,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Compass,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalyticsChart } from "./analytics-chart";
import { toast } from "sonner";

interface AnalyticsViewProps {
  stats: any;
}

export function AnalyticsView({ stats }: AnalyticsViewProps) {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setRefreshing(false);
      toast.success("تم تحديث بيانات الزوار بنجاح");
    }, 600);
  };

  const handleResetAnalytics = async () => {
    if (!window.confirm("هل أنت متأكد من تصفير جميع إحصائيات الزوار والبدء من الصفر؟")) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/analytics/stats", { method: "DELETE" });
      if (res.ok) {
        toast.success("تم تصفير عداد الزوار والبدء بتسجيل الزيارات الفعلية فقط!");
        router.refresh();
      }
    } catch {
      toast.error("حدث خطأ أثناء تصفير الإحصائيات");
    } finally {
      setRefreshing(false);
    }
  };

  const totalDeviceViews =
    stats.devices.desktop + stats.devices.mobile + stats.devices.tablet || 1;
  const mobilePercent = Math.round((stats.devices.mobile / totalDeviceViews) * 100);
  const desktopPercent = Math.round((stats.devices.desktop / totalDeviceViews) * 100);
  const tabletPercent = Math.round((stats.devices.tablet / totalDeviceViews) * 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">إحصائيات وعداد زوار الموقع</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            تتبع دقيق لعدد الزوار، الصفحات الأكثر مشاهدة، والأجهزة المستخدمة لتصفح الموقع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleResetAnalytics}
            disabled={refreshing}
            variant="outline"
            className="text-xs sm:text-sm gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>تصفير العداد</span>
          </Button>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="text-xs sm:text-sm gap-2 bg-slate-50 hover:bg-slate-100"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-primary" : "text-slate-600"}`} />
            <span>تحديث الإحصائيات الآن</span>
          </Button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Unique Visitors */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              إجمالي الأشخاص الذين زاروا الموقع
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.uniqueVisitors}</div>
            <p className="text-xs text-slate-500 mt-1">
              زائر فريد ومميز
            </p>
          </CardContent>
        </Card>

        {/* Total Page Views */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              إجمالي عدد الزيارات والمشاهدات
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.totalVisits}</div>
            <p className="text-xs text-slate-500 mt-1">
              مرة تم تصفح الموقع فيها
            </p>
          </CardContent>
        </Card>

        {/* Today's Visits */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              زوار اليوم
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.todayVisits}</div>
            <p className="text-xs text-emerald-600 font-semibold mt-1">
              +{stats.todayUnique} زائر فريد اليوم
            </p>
          </CardContent>
        </Card>

        {/* Weekly & Monthly */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500">
              زيارات آخر 30 يوماً
            </CardTitle>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.monthlyVisits}</div>
            <p className="text-xs text-slate-500 mt-1">
              منها {stats.weeklyVisits} هذا الأسبوع
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Graph Card */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-900">
            مخطط حركة الزيارات اليومية (آخر 14 يوماً)
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            توضيح عدد مرات فتح الموقع وعدد الزوار الفريدين يوماً بيوم
          </p>
        </CardHeader>
        <CardContent>
          <AnalyticsChart data={stats.chartDays} />
        </CardContent>
      </Card>

      {/* Two columns: Top Pages & Devices/Browsers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Visited Pages */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              الصفحات والموديلات الأكثر زيارة
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              ترتيب الصفحات حسب اهتمام وتصفح الزوار
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topPages.map((page: any) => (
                <div key={page.path} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-xs" title={page.path}>
                      {page.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{page.views} زيارة</span>
                      <span className="text-slate-400">({page.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${page.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Devices and Browsers */}
        <Card className="border-slate-200/80 shadow-xs flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              الأجهزة والمتصفحات المستخدمة
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              طرق وصول العملاء لموقعك
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Devices */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">نوع الجهاز:</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                  <Smartphone className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-emerald-800">{mobilePercent}%</div>
                  <div className="text-[11px] text-emerald-700">هواتف ذكية</div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                  <Monitor className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-blue-800">{desktopPercent}%</div>
                  <div className="text-[11px] text-blue-700">كمبيوتر</div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
                  <Tablet className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-amber-800">{tabletPercent}%</div>
                  <div className="text-[11px] text-amber-700">أجهزة لوحية</div>
                </div>
              </div>
            </div>

            {/* Browsers */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold text-slate-700">المتصفحات الأكثر استخداماً:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.browsers).map(([browser, count]: any) => (
                  <Badge
                    key={browser}
                    variant="outline"
                    className="text-xs px-3 py-1 bg-slate-50 border-slate-200 text-slate-700 flex items-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{browser}:</span>
                    <strong className="text-slate-900">{count}</strong>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Live Visitors Table */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span>سجل الزيارات اللحظي المباشر</span>
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                سجل آخر الزوار الذين تصفحوا صفحات الموقع
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 border-y border-slate-100 text-slate-500">
                <tr>
                  <th className="py-3 px-4 font-semibold">الصفحة التي زارها</th>
                  <th className="py-3 px-4 font-semibold">التاريخ والوقت</th>
                  <th className="py-3 px-4 font-semibold">نوع الجهاز</th>
                  <th className="py-3 px-4 font-semibold">المتصفح والنظام</th>
                  <th className="py-3 px-4 font-semibold">مصدر الزيارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentVisits.map((visit: any) => {
                  const date = new Date(visit.timestamp);
                  const formattedTime = `${date.toLocaleDateString("ar-EG")} - ${date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`;

                  return (
                    <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900" dir="ltr">
                        {visit.path}
                      </td>
                      <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedTime}</span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-medium bg-slate-100 text-slate-700"
                        >
                          {visit.device === "mobile"
                            ? "هاتف محمول"
                            : visit.device === "tablet"
                            ? "جهاز لوحي"
                            : "كمبيوتر"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {visit.browser} ({visit.os})
                      </td>
                      <td className="py-3 px-4 text-slate-500 truncate max-w-[140px]">
                        {visit.referrer}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
