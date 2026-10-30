import { getTranslation, Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

// استيراد جميع المكونات التي تحتاجها صفحتك
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSnippet } from "@/components/about-snippet";
import { FeaturedProducts } from "@/components/featured-products";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  // إنشاء دالة الترجمة `t` بناءً على اللغة الحالية
  const t = (key: string) => getTranslation(locale, key);

  return (
    <main>
      {/* تمرير اللغة (locale) لكل مكون يحتاجها للروابط أو للترجمة */}
      <Navigation locale={locale} />
      
      <HeroSection
        locale={locale}
        title={t("heroTitle")}
        subtitle={t("heroSubtitle")}
        exploreProductsBtn={t("exploreProducts")}
        contactUsBtn={t("contactUs")}
      />
      
      <AboutSnippet
        locale={locale}
        title={t("aboutTitle")}
        description1={t("aboutDescription1")}
        description2={t("aboutDescription2")}
        learnMoreBtn={t("learnMore")}
      />
      
      <FeaturedProducts
        locale={locale}
        title={t("productsSectionTitle")}
        subtitle={t("productsSectionSubtitle")}
        viewDetailsBtn={t("viewDetails")}
        viewAllProductsBtn={t("viewAllProducts")}
      />
      
      <CTASection
        locale={locale}
        title={t("ctaTitle")}
        subtitle={t("ctaSubtitle")}
        getQuoteBtn={t("getQuote")}
        callNowBtn={t("callNow")}
      />
      
      <Footer locale={locale} />
    </main>
  );
}