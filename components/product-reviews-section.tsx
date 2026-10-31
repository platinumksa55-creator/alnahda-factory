"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2, User, CornerDownLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProductComment } from "@/lib/types";

interface ProductReviewsSectionProps {
  productId: number;
  productSlug: string;
  productName: string;
  initialComments: ProductComment[];
  locale: "ar" | "en";
}

export function ProductReviewsSection({
  productId,
  productSlug,
  productName,
  initialComments,
  locale,
}: ProductReviewsSectionProps) {
  const [comments, setComments] = useState<ProductComment[]>(initialComments);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      toast.error(locale === "ar" ? "يرجى كتابة اسمك والتعليق" : "Please enter your name and comment");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          productSlug,
          productName,
          authorName,
          authorEmail,
          content,
          rating,
        }),
      });

      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setAuthorName("");
        setAuthorEmail("");
        setContent("");
        setRating(5);
        setSubmittedSuccess(true);
        toast.success(
          locale === "ar"
            ? "تم نشر تعليقك وتقييمك بنجاح!"
            : "Your review has been posted successfully!"
        );
        setTimeout(() => setSubmittedSuccess(false), 5000);
      } else {
        toast.error(data.error || (locale === "ar" ? "حدث خطأ أثناء إرسال التعليق" : "Error submitting review"));
      }
    } catch {
      toast.error(locale === "ar" ? "تعذر الاتصال بالخادم" : "Server connection failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating =
    comments.length > 0
      ? (comments.reduce((sum, c) => sum + (c.rating || 5), 0) / comments.length).toFixed(1)
      : "5.0";

  return (
    <section className="py-16 bg-white border-t border-neutral-200" id="reviews">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm">
                {locale === "ar" ? "آراء وتقييمات العملاء" : "Customer Reviews"}
              </span>
            </div>
            <h2 className="font-work-sans font-bold text-3xl text-neutral-900">
              {locale === "ar" ? "تقييمات وتجارب العملاء مع هذا المنتج" : "Customer Reviews & Experiences"}
            </h2>
            <p className="text-neutral-500 text-sm mt-1">
              {locale === "ar"
                ? "شاركنا رأيك في جودة المنتج والخامات، وسترد إدارة المصنع على استفساراتك مباشرة."
                : "Share your experience with product quality, and factory management will respond promptly."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
            <div className="text-4xl font-extrabold text-neutral-900 font-work-sans">{avgRating}</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(Number(avgRating))
                        ? "text-amber-400 fill-amber-400"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-neutral-600 font-medium">
                {locale === "ar" ? `مبني على ${comments.length} تعليق` : `Based on ${comments.length} reviews`}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Comments List */}
          <div className="lg:col-span-7 space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12 px-6 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                <MessageSquare className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                <h3 className="font-semibold text-neutral-800 text-lg mb-1">
                  {locale === "ar" ? "كن أول من يقيّم هذا المنتج!" : "Be the first to review this product!"}
                </h3>
                <p className="text-neutral-500 text-sm">
                  {locale === "ar"
                    ? "اكتب تعليقك الآن في النموذج المجاور وشارك تجربتك مع زوار المصنع."
                    : "Leave your comment in the form on the side and share your experience."}
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id} className="border-neutral-200/90 shadow-xs hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                          {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900 text-base">{comment.authorName}</div>
                          <div className="text-xs text-neutral-400">
                            {new Date(comment.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= comment.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-neutral-700 font-open-sans text-sm leading-relaxed whitespace-pre-line">
                      {comment.content}
                    </p>

                    {/* Admin Reply */}
                    {comment.reply && (
                      <div className="mt-4 pt-4 border-t border-neutral-100 bg-amber-50/60 -mx-6 -mb-6 p-5 rounded-b-xl border-l-4 rtl:border-l-0 rtl:border-r-4 border-primary">
                        <div className="flex items-center gap-2 mb-1.5">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-xs text-primary">{comment.reply.repliedBy}</span>
                          <span className="text-[11px] text-neutral-400">
                            {new Date(comment.reply.repliedAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                          </span>
                        </div>
                        <p className="text-neutral-800 text-xs sm:text-sm leading-relaxed">
                          {comment.reply.content}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5">
            <Card className="border-neutral-200 shadow-md sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-work-sans font-bold text-xl text-neutral-900 mb-1">
                  {locale === "ar" ? "أضف تعليقك وتقييمك" : "Write a Review"}
                </h3>
                <p className="text-neutral-500 text-xs mb-5">
                  {locale === "ar"
                    ? "شاركنا رأيك في الموديل أو اطرح أي استفسار حول المواصفات والكميات."
                    : "Share your feedback or ask questions about specs and bulk orders."}
                </p>

                {submittedSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <div className="font-semibold text-emerald-900 text-sm">
                      {locale === "ar" ? "شكراً لمشاركتك!" : "Thank you for your review!"}
                    </div>
                    <div className="text-xs text-emerald-700">
                      {locale === "ar"
                        ? "تم نشر تعليقك وسيتم الرد عليه من قبل إدارة المصنع."
                        : "Your review is published and will be reviewed by our team."}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Star Rating Selector */}
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                        {locale === "ar" ? "تقييمك للمنتج:" : "Your Rating:"}
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= (hoverRating || rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-neutral-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs text-neutral-500 mr-2 rtl:mr-0 rtl:ml-2">
                          ({hoverRating || rating} / 5)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {locale === "ar" ? "الاسم الكريم *" : "Your Name *"}
                      </label>
                      <Input
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={locale === "ar" ? "مثال: م. محمد عبد الله" : "e.g. John Doe"}
                        required
                        className="h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {locale === "ar" ? "البريد الإلكتروني أو الهاتف (اختياري للتواصل)" : "Email or Phone (optional)"}
                      </label>
                      <Input
                        value={authorEmail}
                        onChange={(e) => setAuthorEmail(e.target.value)}
                        placeholder={locale === "ar" ? "name@example.com أو 010xxxxxxxx" : "contact@domain.com"}
                        className="h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        {locale === "ar" ? "نص التعليق أو الاستفسار *" : "Your Comment / Inquiry *"}
                      </label>
                      <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        placeholder={
                          locale === "ar"
                            ? "اكتب تفاصيل تجربتك مع الخامة، الجودة، أو أي سؤال حول التوريد..."
                            : "Share details about fabric feel, durability, or inquire about wholesale..."
                        }
                        required
                        className="text-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 h-11"
                    >
                      <Send className="w-4 h-4 rtl:rotate-180" />
                      <span>{isSubmitting ? (locale === "ar" ? "جاري النشر..." : "Submitting...") : (locale === "ar" ? "إرسال التعليق" : "Submit Review")}</span>
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
