import { getAnalyticsSummary } from "@/lib/analytics-store";
import { AnalyticsView } from "@/components/admin/analytics-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "إحصائيات وعداد الزوار | لوحة التحكم",
};

export default async function AdminAnalyticsPage() {
  const stats = getAnalyticsSummary();

  return <AnalyticsView stats={stats} />;
}
