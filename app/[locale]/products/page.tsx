import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getTranslation, Locale, translations } from "@/lib/i18n";
import { getAllProducts } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = (key: string) => getTranslation(locale, key);
  const productCategories = translations[locale]?.productCategories || [];
  const dynamicProducts = getAllProducts(locale);
  const allProducts = dynamicProducts.length > 0 ? dynamicProducts : (translations[locale]?.allProductsData || []);

  const getCategoryName = (categoryId: string) => {
    const category = productCategories.find(cat => cat.name === categoryId);
    return category ? category.name : categoryId;
  };
  
  return (
    <main>
      <Navigation locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-work-sans font-bold text-4xl lg:text-5xl text-neutral-900 mb-6 text-balance">
              {t("productsPageTitle")}
            </h1>
            <p className="font-open-sans text-xl text-neutral-600 max-w-3xl mx-auto text-balance">
              {t("productsPageSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-neutral-600" />
            <span className="font-work-sans font-medium text-neutral-900">{t("filterByCategory")}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {productCategories.map((category) => (
              <Badge
                key={category.id}
                variant={category.id === "all" ? "default" : "outline"}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  category.id === "all"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white">
                        {getCategoryName(product.category)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-work-sans font-semibold text-xl text-neutral-900 mb-2">{product.name}</h3>
                    <p className="font-open-sans text-neutral-600 mb-4 leading-relaxed h-12 overflow-hidden">
                      {product.description}
                    </p>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Link href={`/${locale}/products/${product.slug}`} className="flex items-center justify-center gap-2">
                        {t("viewDetails")}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}