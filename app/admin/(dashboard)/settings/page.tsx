import { getAdminConfig } from "@/lib/admin-auth";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الإعدادات والأمان | لوحة التحكم",
};

export default async function AdminSettingsPage() {
  const config = await getAdminConfig();

  return (
    <SettingsManager
      initialSettings={{
        username: config.username,
        siteName: config.siteName,
        contactPhone: config.contactPhone,
        contactEmail: config.contactEmail,
        contactAddress: config.contactAddress,
      }}
    />
  );
}
