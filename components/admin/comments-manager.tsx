"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Trash2,
  Reply,
  CheckCircle,
  XCircle,
  ExternalLink,
  Star,
  Send,
  User,
  ShieldCheck,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ProductComment } from "@/lib/types";

interface CommentsManagerProps {
  initialComments: ProductComment[];
}

export function CommentsManager({ initialComments }: CommentsManagerProps) {
  const [comments, setComments] = useState<ProductComment[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = comments.filter((c) => {
    const matchesSearch =
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.authorEmail && c.authorEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, authorName: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف تعليق العميل "${authorName}" نهائياً؟`)) return;

    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        toast.success("تم حذف التعليق بنجاح");
      } else {
        toast.error(data.error || "فشل حذف التعليق");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleUpdateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "status", id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
        toast.success(status === "approved" ? "تمت الموافقة على التعليق ونشره" : "تم رفض التعليق وإخفاؤه");
      } else {
        toast.error(data.error || "فشل تحديث الحالة");
      }
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    }
  };

  const handleSendReply = async (id: string) => {
    if (!replyText.trim()) {
      toast.error("يرجى كتابة نص الرد أولاً");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          id,
          replyContent: replyText.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  reply: {
                    content: replyText.trim(),
                    repliedAt: new Date().toISOString(),
                    repliedBy: "إدارة المصنع",
                  },
                }
              : c
          )
        );
        setReplyingId(null);
        setReplyText("");
        toast.success("تم إرسال الرد الرسمي وحفظه بنجاح على صفحة المنتج!");
      } else {
        toast.error(data.error || "فشل إرسال الرد");
      }
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span>إدارة تعليقات وتقييمات العملاء</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            متابعة جميع آراء العملاء على المنتجات والموديلات، الرد الرسمي عليها، أو حذفها والموافقة عليها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1.5 text-xs bg-slate-50">
            إجمالي التعليقات: <strong className="mr-1 text-slate-900">{comments.length}</strong>
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم العميل، المنتج، أو نص التعليق..."
            className="pr-9 text-xs sm:text-sm h-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            الحالة:
          </span>
          {[
            { id: "all", label: "الكل" },
            { id: "approved", label: "المنشورة" },
            { id: "pending", label: "بانتظار المراجعة" },
            { id: "rejected", label: "المرفوضة" },
          ].map((st) => (
            <Button
              key={st.id}
              variant={statusFilter === st.id ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(st.id)}
              className={`h-8 text-xs shrink-0 ${
                statusFilter === st.id ? "bg-primary text-white" : "text-slate-600"
              }`}
            >
              {st.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">لا توجد تعليقات مطابقة</h3>
            <p className="text-xs text-slate-500 mt-1">جرّب تغيير كلمات البحث أو فلتر الحالة</p>
          </div>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-5 sm:p-6 space-y-4">
                {/* Comment Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {item.authorName ? item.authorName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm">{item.authorName}</span>
                        {item.authorEmail && (
                          <span className="text-xs text-slate-400" dir="ltr">
                            {item.authorEmail}
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-[11px] px-2 py-0.5 ${
                            item.status === "approved"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : item.status === "pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {item.status === "approved" ? "منشور" : item.status === "pending" ? "قيد المراجعة" : "مرفوض"}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleString("ar-EG")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5 ml-2 rtl:ml-0 rtl:mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= item.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Linked Product Link */}
                    <Link
                      href={`/ar/products/${item.productSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1 rounded-md"
                    >
                      <span>{item.productName}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Comment Body */}
                <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                  {item.content}
                </div>

                {/* Existing Reply */}
                {item.reply && (
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span>رد {item.reply.repliedBy}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {new Date(item.reply.repliedAt).toLocaleString("ar-EG")}
                      </span>
                    </div>
                    <p className="text-slate-800 text-xs sm:text-sm leading-relaxed">
                      {item.reply.content}
                    </p>
                  </div>
                )}

                {/* Replying Form Drawer */}
                {replyingId === item.id && (
                  <div className="bg-white border-2 border-primary/30 rounded-xl p-4 space-y-3 animate-in fade-in">
                    <div className="font-semibold text-xs text-slate-800">
                      كتابة رد رسمي من إدارة المصنع يظهر أسفل تعليق العميل:
                    </div>
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      placeholder="أهلاً بك عميلنا العزيز، نشكرك على ثقتك..."
                      className="text-xs sm:text-sm resize-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText("");
                        }}
                        className="text-xs h-8"
                      >
                        إلغاء
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={isSubmitting}
                        onClick={() => handleSendReply(item.id)}
                        className="bg-primary hover:bg-primary/90 text-white text-xs h-8 flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                        <span>نشر الرد</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingId(replyingId === item.id ? null : item.id);
                        setReplyText(item.reply?.content || "");
                      }}
                      className="text-xs h-8 flex items-center gap-1.5 text-primary border-primary/30 hover:bg-primary/5"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span>{item.reply ? "تعديل الرد" : "الرد على العميل"}</span>
                    </Button>

                    {item.status !== "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "approved")}
                        className="text-xs h-8 flex items-center gap-1 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>موافقة ونشر</span>
                      </Button>
                    )}

                    {item.status !== "rejected" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(item.id, "rejected")}
                        className="text-xs h-8 flex items-center gap-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>حجب</span>
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id, item.authorName)}
                    className="text-xs h-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
