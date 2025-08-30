import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const productCategories = [
  { id: "all", name: "جميع المنتجات", count: 24 },
  { id: "cotton", name: "أقمشة القطن", count: 8 },
  { id: "linen", name: "منسوجات الكتان", count: 6 },
  { id: "silk", name: "أقمشة الحرير", count: 4 },
  { id: "blended", name: "منسوجات مخلوطة", count: 3 },
  { id: "home-decor", name: "أقمشة الديكور", count: 2 },
  { id: "industrial", name: "منسوجات صناعية", count: 1 },
]

const allProducts = [
  {
    id: 1,
    name: "قطن فاخر أبيض",
    description: "قماش قطني عالي الجودة، مثالي للملابس الراقية",
    image: "/luxury-cotton-fabric-texture-close-up.png",
    category: "cotton",
    price: "من 45 ريال/متر",
    slug: "luxury-white-cotton",
    features: ["100% قطن", "نعومة فائقة", "مقاوم للتجعد"],
  },
  {
    id: 2,
    name: "كتان طبيعي بيج",
    description: "كتان طبيعي بلون بيج أنيق، مناسب للأزياء الصيفية",
    image: "/natural-linen-fabric-texture-in-earth-tones.png",
    category: "linen",
    price: "من 65 ريال/متر",
    slug: "natural-beige-linen",
    features: ["100% كتان", "تهوية ممتازة", "صديق للبيئة"],
  },
  {
    id: 3,
    name: "حرير فاخر ذهبي",
    description: "حرير طبيعي بلمعان ذهبي رائع للمناسبات الخاصة",
    image: "/premium-silk-fabric-with-natural-sheen.png",
    category: "silk",
    price: "من 120 ريال/متر",
    slug: "luxury-golden-silk",
    features: ["100% حرير", "لمعان طبيعي", "ملمس حريري"],
  },
  {
    id: 4,
    name: "مزيج قطن وبوليستر",
    description: "قماش مبتكر يجمع بين راحة القطن ومتانة البوليستر",
    image: "/modern-blended-textile-fabric-samples.png",
    category: "blended",
    price: "من 35 ريال/متر",
    slug: "cotton-polyester-blend",
    features: ["مزيج متطور", "سهل العناية", "مقاوم للانكماش"],
  },
  {
    id: 5,
    name: "أقمشة تنجيد فاخرة",
    description: "أقمشة عالية الجودة للأثاث والديكور المنزلي",
    image: "/home-decor-upholstery-fabric-patterns.png",
    category: "home-decor",
    price: "من 80 ريال/متر",
    slug: "luxury-upholstery-fabrics",
    features: ["مقاوم للبقع", "متين", "ألوان ثابتة"],
  },
  {
    id: 6,
    name: "منسوجات تقنية صناعية",
    description: "أقمشة متخصصة للاستخدامات الصناعية والتقنية",
    image: "/technical-industrial-textile-materials.png",
    category: "industrial",
    price: "حسب المواصفات",
    slug: "technical-industrial-textiles",
    features: ["مقاوم للحرارة", "عالي المتانة", "مواصفات خاصة"],
  },
  {
    id: 7,
    name: "قطن عضوي طبيعي",
    description: "قماش قطني عضوي صديق للبيئة والبشرة الحساسة",
    image: "/luxury-cotton-fabric-texture-close-up.png",
    category: "cotton",
    price: "من 55 ريال/متر",
    slug: "organic-natural-cotton",
    features: ["عضوي معتمد", "خالي من الكيماويات", "صحي وآمن"],
  },
  {
    id: 8,
    name: "كتان مصبوغ طبيعياً",
    description: "كتان مصبوغ بألوان طبيعية متنوعة",
    image: "/natural-linen-fabric-texture-in-earth-tones.png",
    category: "linen",
    price: "من 70 ريال/متر",
    slug: "naturally-dyed-linen",
    features: ["صبغات طبيعية", "ألوان ثابتة", "صديق للبيئة"],
  },
  {
    id: 9,
    name: "حرير مطبوع بأنماط تراثية",
    description: "حرير فاخر بطباعة أنماط تراثية عربية",
    image: "/premium-silk-fabric-with-natural-sheen.png",
    category: "silk",
    price: "من 150 ريال/متر",
    slug: "heritage-printed-silk",
    features: ["طباعة تراثية", "ألوان زاهية", "تصميم حصري"],
  },
]

export default function ProductsPage() {
  return (
    <main>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-work-sans font-bold text-4xl lg:text-5xl text-neutral-900 mb-6 text-balance">
              منتجاتنا
            </h1>
            <p className="font-open-sans text-xl text-neutral-600 max-w-3xl mx-auto text-balance">
              اكتشف مجموعتنا الواسعة من الأقمشة والمنسوجات عالية الجودة المصنوعة بأحدث التقنيات
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-neutral-600" />
            <span className="font-work-sans font-medium text-neutral-900">تصفية حسب الفئة:</span>
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
                {category.name} ({category.count})
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
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-white">
                        {productCategories.find((cat) => cat.id === product.category)?.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-work-sans font-semibold text-xl text-neutral-900 mb-2">{product.name}</h3>
                    <p className="font-open-sans text-neutral-600 mb-4 leading-relaxed">{product.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-neutral-300 text-neutral-600">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-work-sans font-semibold text-lg text-primary">{product.price}</span>
                    </div>

                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Link href={`/products/${product.slug}`} className="flex items-center justify-center gap-2">
                        عرض التفاصيل
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent px-8"
            >
              عرض المزيد من المنتجات
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-work-sans font-bold text-3xl lg:text-4xl mb-6 text-balance">لم تجد ما تبحث عنه؟</h2>
          <p className="font-open-sans text-lg lg:text-xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">
            نحن نقدم حلول مخصصة لاحتياجاتك الخاصة. تواصل معنا لمناقشة متطلباتك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-neutral-100 px-8">
              <Link href="/contact">طلب عرض أسعار مخصص</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary px-8 bg-transparent"
            >
              <Link href="/about">تعرف على قدراتنا</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
