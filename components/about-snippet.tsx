import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

export function AboutSnippet({
  title,
  description1,
  description2,
  learnMoreBtn,
  locale,
}: {
  title: string;
  description1: string;
  description2: string;
  learnMoreBtn: string;
  locale: Locale;
}) {
  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-work-sans font-bold text-3xl lg:text-4xl text-neutral-900 mb-6 text-balance">
              {title}
            </h2>
            <p className="font-open-sans text-lg text-neutral-700 mb-6 leading-relaxed">{description1}</p>
            <p className="font-open-sans text-lg text-neutral-700 mb-8 leading-relaxed">{description2}</p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              <Link href={`/${locale}/about`} className="flex items-center gap-2">
                {learnMoreBtn}
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            {/* ---===[ تم تعديل مسار الصورة هنا ]===--- */}
            <Image
              src="/images/textile-factory-workers-operating-modern-weaving-m.png"
              alt={title} // تم تحسين النص البديل ليستخدم العنوان
              width={600}
              height={500}
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}