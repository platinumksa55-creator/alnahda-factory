import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/lib/i18n"; // 1. استيراد النوع Locale

// 2. المكون الآن يستقبل اللغة والنصوص كـ props
export function CTASection({
  locale,
  title,
  subtitle,
  getQuoteBtn,
  callNowBtn,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  getQuoteBtn: string;
  callNowBtn: string;
}) {
  return (
    <section className="py-16 lg:py-24 bg-primary text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 3. استخدام الـ props مباشرة لعرض النصوص */}
        <h2 className="font-work-sans font-bold text-3xl lg:text-4xl mb-6 text-balance">{title}</h2>
        <p className="font-open-sans text-lg lg:text-xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 px-8">
            {/* 4. تم تعديل رابط "اتصل بنا" ليشمل اللغة */}
            <Link href={`/${locale}/contact`} className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {getQuoteBtn}
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent"
          >
            <Link href="tel:+201222422996" className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {callNowBtn}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}