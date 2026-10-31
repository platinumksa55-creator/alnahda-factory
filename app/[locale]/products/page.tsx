import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ProductsCatalog } from "@/components/products-catalog";
import { getTranslation, Locale, translations } from "@/lib/i18n";
import { getAllProducts } from "@/lib/products-store";

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = (key: string) => getTranslation(locale, key);
  const productCategories = translations[locale]?.productCategories || [];
  const dynamicProducts = await getAllProducts(locale);
  const allProducts = dynamicProducts.length > 0 ? dynamicProducts : (translations[locale]?.allProductsData || []);
  
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

      <ProductsCatalog
        locale={locale}
        categories={productCategories}
        products={allProducts}
        filterLabel={t("filterByCategory")}
        viewDetailsLabel={t("viewDetails")}
      />

      <Footer locale={locale} />
    </main>
  );
}