"use client";

import { useState } from "react";
import { Lock, Shield, Phone, Mail, MapPin, Check, AlertCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface SettingsManagerProps {
  initialSettings: {
    username: string;
    siteName: { ar: string; en: string };
    contactPhone: string;
    contactEmail: string;
    contactAddress: { ar: string; en: string };
  };
}

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Info state
  const [phone, setPhone] = useState(initialSettings.contactPhone || "");
  const [email, setEmail] = useState(initialSettings.contactEmail || "");
  const [addressAr, setAddressAr] = useState(initialSettings.contactAddress?.ar || "");
  const [siteNameAr, setSiteNameAr] = useState(initialSettings.siteName?.ar || "");
  const [infoLoading, setInfoLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("يرجى ملء جميع حقول كلمة المرور");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمة المرور الجديدة وتأكيدها غير متطابقين");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "change_password",
          oldPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "فشل تغيير كلمة المرور");
        setPasswordLoading(false);
        return;
      }

      toast.success("تم تغيير كلمة المرور بنجاح!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("حدث خطأ أثناء تغيير كلمة المرور");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleInfoChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_info",
          contactPhone: phone,
          contactEmail: email,
          contactAddress: {
            ar: addressAr,
            en: initialSettings.contactAddress?.en || addressAr,
          },
          siteName: {
            ar: siteNameAr,
            en: initialSettings.siteName?.en || siteNameAr,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.error || "فشل حفظ البيانات");
        setInfoLoading(false);
        return;
      }

      toast.success("تم تحديث بيانات الاتصال بنجاح!");
    } catch {
      toast.error("حدث خطأ أثناء حفظ البيانات");
    } finally {
      setInfoLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h1 className="text-2xl font-bold text-slate-900">الإعدادات والأمان</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          إدارة كلمة مرور لوحة التحكم ومعلومات الاتصال الخاصة بالمصنع
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security / Password Change */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  تغيير كلمة مرور لوحة التحكم
                </CardTitle>
                <p className="text-xs text-slate-500">
                  قم بتعيين كلمة مرور قوية لحماية لوحة التحكم
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="oldPass" className="text-xs font-semibold text-slate-700">
                  كلمة المرور الحالية
                </Label>
                <Input
                  id="oldPass"
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-xs sm:text-sm text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="newPass" className="text-xs font-semibold text-slate-700">
                  كلمة المرور الجديدة
                </Label>
                <Input
                  id="newPass"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-xs sm:text-sm text-right"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPass" className="text-xs font-semibold text-slate-700">
                  تأكيد كلمة المرور الجديدة
                </Label>
                <Input
                  id="confirmPass"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-xs sm:text-sm text-right"
                  dir="ltr"
                />
              </div>

              <Button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm"
              >
                {passwordLoading ? "جاري التحديث..." : "حفظ كلمة المرور الجديدة"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Factory Contact Info */}
        <Card className="border-slate-200/80 shadow-xs">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  معلومات المصنع
                </CardTitle>
                <p className="text-xs text-slate-500">
                  بيانات التواصل والعنوان
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInfoChange} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="siteName" className="text-xs font-semibold text-slate-700">
                  اسم الشركة / المصنع
                </Label>
                <Input
                  id="siteName"
                  value={siteNameAr}
                  onChange={(e) => setSiteNameAr(e.target.value)}
                  placeholder="النهضة للمنسوجات"
                  className="text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                  رقم الهاتف / واتساب
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+201222422996"
                  className="text-xs sm:text-sm"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                  البريد الإلكتروني الرسمي
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@alnahdafactory.com"
                  className="text-xs sm:text-sm"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-slate-700">
                  العنوان
                </Label>
                <Input
                  id="address"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  placeholder="المحلة الكبرى - 2 شارع الحلو - طريق دمرو"
                  className="text-xs sm:text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={infoLoading}
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{infoLoading ? "جاري الحفظ..." : "حفظ بيانات المصنع"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
