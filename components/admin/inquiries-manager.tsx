"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Building2,
  Clock,
  CheckCircle2,
  Trash2,
  MessageCircle,
  Search,
  Filter,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ContactInquiry } from "@/lib/types";

export function InquiriesManager({ initialInquiries }: { initialInquiries: ContactInquiry[] }) {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleUpdateStatus = async (id: string, status: "new" | "read" | "replied") => {
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
        toast.success("تم تحديث حالة الرسالة");
      }
    } catch {
      toast.error("حدث خطأ أثناء تحديث الحالة");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        toast.success("تم حذف الرسالة بنجاح");
      }
    } catch {
      toast.error("فشل حذف الرسالة");
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.phone && inq.phone.includes(search)) ||
      inq.message.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const newCount = inquiries.filter((i) => i.status === "new").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900">رسائل واستفسارات العملاء</h1>
            {newCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                {newCount} جديد
              </Badge>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            جميع طلبات الأسعار والاستفسارات المرسلة من صفحة "تواصل معنا" في الموقع
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="بحث بالاسم، رقم الهاتف، البريد، أو محتوى الرسالة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 bg-slate-50 border-slate-200 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="text-xs h-9"
          >
            الكل ({inquiries.length})
          </Button>
          <Button
            variant={statusFilter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("new")}
            className="text-xs h-9"
          >
            جديدة ({newCount})
          </Button>
          <Button
            variant={statusFilter === "replied" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("replied")}
            className="text-xs h-9"
          >
            تم الرد ({inquiries.filter((i) => i.status === "replied").length})
          </Button>
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">لا توجد رسائل حالياً</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            عندما يقوم أي عميل بإرسال طلب عرض سعر أو استفسار من صفحة التواصل، سيظهر هنا تلقائياً.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const date = new Date(inq.createdAt);
            const cleanPhone = inq.phone ? inq.phone.replace(/[^0-9+]/g, "") : "";

            return (
              <Card
                key={inq.id}
                className={`border transition-all ${
                  inq.status === "new"
                    ? "border-primary/40 bg-primary/[0.02] shadow-sm"
                    : "border-slate-200/80 bg-white shadow-xs"
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {inq.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{inq.name}</h3>
                          {inq.status === "new" && (
                            <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0">
                              رسالة جديدة
                            </Badge>
                          )}
                          {inq.status === "replied" && (
                            <Badge className="bg-emerald-600 text-white text-[10px] px-2 py-0">
                              تم التواصل
                            </Badge>
                          )}
                          {inq.service && (
                            <Badge variant="outline" className="text-[11px] bg-slate-50">
                              {inq.service}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                          {inq.company && (
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5" />
                              {inq.company}
                            </span>
                          )}
                          <span className="flex items-center gap-1" dir="ltr">
                            <Mail className="w-3.5 h-3.5" />
                            {inq.email}
                          </span>
                          {inq.phone && (
                            <span className="flex items-center gap-1" dir="ltr">
                              <Phone className="w-3.5 h-3.5" />
                              {inq.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {date.toLocaleDateString("ar-EG")} -{" "}
                        {date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                    {inq.message}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {cleanPhone && (
                        <Button
                          asChild
                          size="sm"
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                          onClick={() => handleUpdateStatus(inq.id, "replied")}
                        >
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.slice(1) : cleanPhone.startsWith("0") ? "2" + cleanPhone : cleanPhone}?text=${encodeURIComponent(`مرحباً أستاذ ${inq.name}، نتواصل معك من إدارة مصنع النهضة للمنسوجات بخصوص استفسارك على الموقع.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>رد عبر واتساب</span>
                          </a>
                        </Button>
                      )}

                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={() => handleUpdateStatus(inq.id, "replied")}
                      >
                        <a href={`mailto:${inq.email}?subject=رد من مصنع النهضة للمنسوجات`}>
                          <Mail className="w-3.5 h-3.5" />
                          <span>رد بالإيميل</span>
                        </a>
                      </Button>

                      {inq.status !== "replied" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(inq.id, "replied")}
                          className="h-8 text-xs text-emerald-700 hover:bg-emerald-50 gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تحديد كـ "تم التواصل"</span>
                        </Button>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(inq.id)}
                      className="h-8 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5 ml-1" />
                      <span>حذف</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
