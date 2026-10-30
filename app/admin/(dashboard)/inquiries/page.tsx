import { getInquiries } from "@/lib/inquiries-store";
import { InquiriesManager } from "@/components/admin/inquiries-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "رسائل العملاء | لوحة التحكم",
};

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();
  return <InquiriesManager initialInquiries={inquiries} />;
}
