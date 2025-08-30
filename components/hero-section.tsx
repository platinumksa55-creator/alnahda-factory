import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { BackgroundVideo } from "./background-video"; // 1. استيراد مكون الفيديو الجديد

export function HeroSection({
  title,
  subtitle,
  exploreProductsBtn,
  contactUsBtn,
  locale,
}: {
  title: string;
  subtitle: string;
  exploreProductsBtn: string;
  contactUsBtn: string;
  locale: Locale;
}) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 2. تم استبدال كود الفيديو المؤقت بالمكون الجديد */}
      <BackgroundVideo />

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-work-sans font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 text-balance">
          {title}
        </h1>
        <p className="font-open-sans text-lg sm:text-xl lg:text-2xl mb-8 text-balance opacity-90 max-w-2xl mx-auto">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
            <Link href={`/${locale}/products`} className="flex items-center gap-2">
              {exploreProductsBtn}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-3 text-lg bg-transparent backdrop-blur-sm"
          >
            <Link href={`/${locale}/contact`}>{contactUsBtn}</Link>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}