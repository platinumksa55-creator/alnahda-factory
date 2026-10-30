import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Award, Globe, Clock, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslation, Locale } from "@/lib/i18n";

const values = [
  { titleKey: "valueQuality", descriptionKey: "valueQualityDesc", icon: Award },
  { titleKey: "valueInnovation", descriptionKey: "valueInnovationDesc", icon: Globe },
  { titleKey: "valueReliability", descriptionKey: "valueReliabilityDesc", icon: Users },
  { titleKey: "valueSustainability", descriptionKey: "valueSustainabilityDesc", icon: Clock },
];

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = (key: string) => getTranslation(locale, key);

  return (
    <main>
      <Navigation locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-work-sans font-bold text-4xl lg:text-5xl text-neutral-900 mb-6 text-balance">{t("aboutPageTitle")}</h1>
            <p className="font-open-sans text-xl text-neutral-600 max-w-3xl mx-auto text-balance">
              {t("aboutPageSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="font-work-sans font-bold text-3xl lg:text-4xl text-neutral-900 mb-6 text-balance">
                {t("ourStoryTitle")}
              </h2>
              <p className="font-open-sans text-lg text-neutral-700 mb-6 leading-relaxed">{t("ourStoryText1")}</p>
              <p className="font-open-sans text-lg text-neutral-700 mb-6 leading-relaxed">{t("ourStoryText2")}</p>
              <p className="font-open-sans text-lg text-neutral-700 mb-8 leading-relaxed">{t("ourStoryText3")}</p>
            </div>
            <div>
              {/* ---===[ تم تعديل مسار الصورة هنا ]===--- */}
              <Image
                src="/images/textile-factory-workers-operating-modern-weaving-m.png"
                alt={t("ourStoryTitle")}
                width={600}
                height={500}
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <h3 className="font-work-sans font-bold text-2xl text-neutral-900 mb-4">{t("missionTitle")}</h3>
                <p className="font-open-sans text-lg text-neutral-700 leading-relaxed">{t("missionText")}</p>
              </CardContent>
            </Card>
            <Card className="p-8 border-0 shadow-lg">
              <CardContent className="p-0">
                <h3 className="font-work-sans font-bold text-2xl text-neutral-900 mb-4">{t("visionTitle")}</h3>
                <p className="font-open-sans text-lg text-neutral-700 leading-relaxed">{t("visionText")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-work-sans font-bold text-3xl lg:text-4xl text-neutral-900 mb-4 text-balance">{t("valuesTitle")}</h2>
            <p className="font-open-sans text-lg text-neutral-600 max-w-2xl mx-auto text-balance">{t("valuesSubtitle")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-work-sans font-semibold text-xl text-neutral-900 mb-3">{t(value.titleKey)}</h3>
                  <p className="font-open-sans text-neutral-600 leading-relaxed">{t(value.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-work-sans font-bold text-3xl lg:text-4xl mb-6 text-balance">{t("ctaAboutTitle")}</h2>
          <p className="font-open-sans text-lg lg:text-xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">{t("ctaAboutSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 px-8">
              <Link href={`/${locale}/products`} className="flex items-center gap-2">
                {t("exploreProductsBtn")}
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent">
              <Link href={`/${locale}/contact`}>{t("contactUs")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}