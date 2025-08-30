import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// 1. استيراد كائن الترجمة الرئيسي
import { getTranslation, Locale, translations } from "@/lib/i18n";

export function FeaturedProducts({
  locale,
  title,
  subtitle,
  viewDetailsBtn,
  viewAllProductsBtn,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  viewDetailsBtn: string;
  viewAllProductsBtn: string;
}) {
  const t = (key: string) => getTranslation(locale, key);

  // 2. تم حذف القائمة القديمة، والآن يتم جلب أول 3 منتجات من البيانات الرئيسية
  const featuredProducts = translations[locale]?.allProductsData.slice(0, 3) || [];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-open-sans text-neutral-900">
            {title}
          </h2>
          <p className="mt-3 text-neutral-600 font-open-sans">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden group rounded-2xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-56">
                {/* 3. الآن سيتم استخدام مسار الصورة الصحيح من i18n.ts تلقائيًا */}
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="text-xl font-semibold font-open-sans text-neutral-900 mb-1">
                  {product.name}
                </h3>
                <p className="text-neutral-600 font-open-sans mb-4 h-12 overflow-hidden">
                  {product.description}
                </p>
                <Button asChild variant="outline" className="font-open-sans">
                  <Link href={`/${locale}/products/${product.slug}`} className="flex items-center gap-2">
                    {viewDetailsBtn}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 font-open-sans"
          >
            <Link href={`/${locale}/products`} className="flex items-center gap-2">
              {viewAllProductsBtn}
              <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}