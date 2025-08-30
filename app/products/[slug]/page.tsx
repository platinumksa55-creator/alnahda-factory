import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Check, Phone, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

// Sample product data - in a real app, this would come from a database
const productData: Record<string, any> = {
  "luxury-white-cotton": {
    id: 1,
    name: "قطن فاخر أبيض",
    description: "قماش قطني عالي الجودة، مثالي للملابس الراقية والاستخدامات المتنوعة",
    longDescription:
      "يتميز هذا القماش القطني الفاخر بنعومته الاستثنائية وجودته العالية. مصنوع من أجود أنواع القطن المختارة بعناية، يوفر راحة لا مثيل لها وملمساً حريرياً. مثالي لصناعة الملابس الراقية، الفراش الفاخر، والمنسوجات المنزلية عالية الجودة.",
    images: [
      "/luxury-cotton-fabric-texture-close-up.png",
      "/textile-factory-workers-operating-modern-weaving-m.png",
      "/modern-blended-textile-fabric-samples.png",
    ],
    category: "أقمشة القطن",
    price: "من 45 ريال/متر",
    minOrder: "100 متر",
    availability: "متوفر",
    rating: 4.8,
    reviews: 24,
    specifications: {
      المادة: "100% قطن طبيعي",
      الوزن: "180 جم/متر مربع",
      العرض: "150 سم",
      اللون: "أبيض ناصع",
      المعالجة: "مقاوم للتجعد",
      العناية: "قابل للغسيل في الغسالة",
    },
    features: [
      "100% قطن طبيعي عالي الجودة",
      "نعومة فائقة وملمس حريري",
      "مقاوم للتجعد والانكماش",
      "تهوية ممتازة وامتصاص للرطوبة",
      "ألوان ثابتة لا تبهت",
      "صديق للبيئة وآمن للبشرة الحساسة",
    ],
    applications: [
      "الملابس الراقية والأزياء",
      "الفراش والمنسوجات المنزلية",
      "ملابس الأطفال والرضع",
      "المناشف والأدوات الصحية",
      "الستائر والديكور المنزلي",
    ],
  },
}

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = productData[params.slug]

  if (!product) {
    notFound()
  }

  return (
    <main>
      <Navigation />

      {/* Breadcrumb */}
      <section className="pt-20 pb-8 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm">
            <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <ArrowLeft className="w-4 h-4 text-neutral-400 rotate-180" />
            <Link href="/products" className="text-neutral-600 hover:text-primary transition-colors">
              المنتجات
            </Link>
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
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={500}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.slice(1).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - صورة ${index + 2}`}
                      width={200}
                      height={150}
                      className="w-full h-24 object-cover"
                    />
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
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">({product.reviews} تقييم)</span>
                </div>
              </div>

              <h1 className="font-work-sans font-bold text-3xl lg:text-4xl text-neutral-900 mb-4">{product.name}</h1>

              <p className="font-open-sans text-lg text-neutral-700 mb-6 leading-relaxed">{product.longDescription}</p>

              {/* Price and Availability */}
              <div className="bg-neutral-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-work-sans font-bold text-2xl text-primary">{product.price}</span>
                    <span className="text-sm text-neutral-600 mr-2">الحد الأدنى: {product.minOrder}</span>
                  </div>
                  <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                    {product.availability}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white flex-1">
                    <Link href="/contact" className="flex items-center justify-center gap-2">
                      طلب عرض أسعار
                      <Mail className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent flex-1"
                  >
                    <Link href="https://wa.me/966123456789" className="flex items-center justify-center gap-2">
                      واتساب
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-3">المميزات الرئيسية</h3>
                <div className="grid gap-2">
                  {product.features.map((feature: string, index: number) => (
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

      {/* Detailed Information Tabs */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Specifications */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-work-sans font-bold text-xl text-neutral-900 mb-4">المواصفات التقنية</h3>
                <div className="space-y-3">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2">
                      <span className="font-open-sans font-medium text-neutral-700">{key}</span>
                      <span className="font-open-sans text-neutral-900">{value as string}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-work-sans font-bold text-xl text-neutral-900 mb-4">الاستخدامات</h3>
                <div className="space-y-2">
                  {product.applications.map((application: string, index: number) => (
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

      {/* Related Products */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-work-sans font-bold text-3xl text-neutral-900 mb-8 text-center">منتجات ذات صلة</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Related Product 1 */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/natural-linen-fabric-texture-in-earth-tones.png"
                    alt="كتان طبيعي بيج"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-2">كتان طبيعي بيج</h3>
                  <p className="font-open-sans text-neutral-600 text-sm mb-3">كتان طبيعي عالي الجودة</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <Link href="/products/natural-beige-linen">عرض التفاصيل</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Product 2 */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/premium-silk-fabric-with-natural-sheen.png"
                    alt="حرير فاخر ذهبي"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-2">حرير فاخر ذهبي</h3>
                  <p className="font-open-sans text-neutral-600 text-sm mb-3">حرير طبيعي بلمعان رائع</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <Link href="/products/luxury-golden-silk">عرض التفاصيل</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Product 3 */}
            <Card className="group hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardContent className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src="/modern-blended-textile-fabric-samples.png"
                    alt="مزيج قطن وبوليستر"
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-2">مزيج قطن وبوليستر</h3>
                  <p className="font-open-sans text-neutral-600 text-sm mb-3">قماش مبتكر متطور</p>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <Link href="/products/cotton-polyester-blend">عرض التفاصيل</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-work-sans font-bold text-3xl lg:text-4xl mb-6 text-balance">
            هل تحتاج مساعدة في الاختيار؟
          </h2>
          <p className="font-open-sans text-lg lg:text-xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">
            فريقنا المتخصص جاهز لمساعدتك في اختيار المنتج المناسب لاحتياجاتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 px-8">
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                تواصل مع خبرائنا
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent"
            >
              <Link href="/products">تصفح المزيد من المنتجات</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

// Generate static params for known products
export function generateStaticParams() {
  return Object.keys(productData).map((slug) => ({
    slug,
  }))
}

// Generate metadata for SEO
export function generateMetadata({ params }: ProductPageProps) {
  const product = productData[params.slug]

  if (!product) {
    return {
      title: "المنتج غير موجود",
    }
  }

  return {
    title: `${product.name} | النهضة للمنسوجات`,
    description: product.description,
    keywords: `${product.name}, أقمشة, منسوجات, ${product.category}`,
  }
}
