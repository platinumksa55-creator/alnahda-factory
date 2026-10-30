import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Check, Phone, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslation, Locale, translations } from "@/lib/i18n";
import { getProductBySlug, getAllProducts } from "@/lib/products-store";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface ProductPageProps {
  params: Promise<{
    slug: string;
    locale: Locale;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = (await getProductBySlug(slug, locale)) || translations[locale]?.allProductsData?.find((p) => p.slug === slug);
  const t = (key: string) => getTranslation(locale, key);

  if (!product) {
    return { title: t("productNotFound") };
  }

  return {
    title: `${product.name} | ${t("companyName")}`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const t = (key: string) => getTranslation(locale, key);
  
  const allProducts = await getAllProducts(locale);
  const product = (await getProductBySlug(slug, locale)) || translations[locale]?.allProductsData?.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }
  
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.slug !== product.slug).slice(0, 3);
  
  const whatsappNumber = getTranslation(locale, "contactPhone");
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

  return (
    <main>
      <Navigation locale={locale} />

      {/* Breadcrumb */}
      <section className="pt-20 pb-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <Link href={`/${locale}`} className="text-neutral-600 hover:text-primary transition-colors">{t("home")}</Link>
            <ArrowLeft className="w-4 h-4 text-neutral-400 rotate-180" />
            <Link href={`/${locale}/products`} className="text-neutral-600 hover:text-primary transition-colors">{t("products")}</Link>
            <ArrowLeft className="w-4 h-4 text-neutral-400 rotate-180" />
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                {product.images && product.images.length > 0 && (
                  <Image src={product.images[0]} alt={product.name} width={600} height={500} className="w-full h-96 object-cover" />
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images && product.images.slice(1).map((image: string, index: number) => (
                  <div key={index} className="relative overflow-hidden rounded-lg shadow-md">
                    <Image src={image} alt={`${product.name} - image ${index + 2}`} width={200} height={150} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Badge className="bg-primary text-white mb-2">{product.category}</Badge>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => ( <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-neutral-300"}`} /> ))}
                  </div>
                  <span className="text-sm text-neutral-600">({product.reviews} {t("productReviews")})</span>
                </div>
              </div>
              <h1 className="font-work-sans font-bold text-3xl lg:text-4xl text-neutral-900 mb-4">{product.name}</h1>
              <p className="font-open-sans text-lg text-neutral-700 mb-6 leading-relaxed">{product.longDescription}</p>
              
              <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="font-work-sans font-bold text-2xl text-primary">{t("getQuote")}</span>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">{t("available")}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white flex-1">
                    <Link href={`/${locale}/contact`} className="flex items-center justify-center gap-2">{t("contactExperts")}<Mail className="w-4 h-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent flex-1">
                    <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">{t("whatsapp")}<MessageCircle className="w-4 h-4" /></Link>
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-3">{t("keyFeatures")}</h3>
                <div className="grid gap-2">
                  {product.features && product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="font-open-sans text-neutral-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---===[ هذا هو القسم الذي كان مفقودًا ]===--- */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-work-sans font-bold text-xl text-neutral-900 mb-4">{t("specifications")}</h3>
                <div className="space-y-3">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b">
                      <span className="font-open-sans font-medium text-neutral-700">{key}</span>
                      <span className="font-open-sans text-neutral-900">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-work-sans font-bold text-xl text-neutral-900 mb-4">{t("applications")}</h3>
                <div className="space-y-2">
                  {product.applications && product.applications.map((application: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="font-open-sans text-neutral-700">{application}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-work-sans font-bold text-3xl text-neutral-900 mb-8 text-center">{t("relatedProducts")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <Card key={related.id} className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image src={related.images[0]} alt={related.name} width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                    <div className="p-4">
                      <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-2">{related.name}</h3>
                      <p className="font-open-sans text-neutral-600 text-sm mb-3 h-10 overflow-hidden">{related.description}</p>
                      <Button asChild variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent">
                        <Link href={`/${locale}/products/${related.slug}`}>{t("viewDetails")}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-work-sans font-bold text-3xl lg:text-4xl mb-6 text-balance">{t("productDetailCTA")}</h2>
          <p className="font-open-sans text-lg lg:text-xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">{t("productDetailCTASubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 px-8">
              <Link href={`/${locale}/contact`} className="flex items-center gap-2"><Phone className="w-5 h-5" />{t("contactExperts")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent">
              <Link href={`/${locale}/products`}>{t("browseMoreProducts")}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  );
}