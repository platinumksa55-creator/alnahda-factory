"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, PackageOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";

interface CategoryOption {
  id: string;
  name: string;
}

interface LocalizedProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryId?: string;
  images: string[];
}

interface ProductsCatalogProps {
  locale: Locale;
  categories: CategoryOption[];
  products: LocalizedProduct[];
  filterLabel: string;
  viewDetailsLabel: string;
}

export function ProductsCatalog({
  locale,
  categories,
  products,
  filterLabel,
  viewDetailsLabel,
}: ProductsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getCategoryName = (catValue: string, catId?: string) => {
    const byId = categories.find((c) => c.id === catId || c.id === catValue);
    if (byId) return byId.name;
    const byName = categories.find((c) => c.name === catValue);
    return byName ? byName.name : catValue;
  };

  const matchesCategory = (product: LocalizedProduct, cat: CategoryOption) => {
    if (cat.id === "all") return true;
    return (
      product.categoryId === cat.id ||
      product.category === cat.name ||
      product.category === cat.id
    );
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = products.filter((p) => matchesCategory(p, cat)).length;
    }
    return counts;
  }, [categories, products]);

  const filteredProducts = useMemo(() => {
    const activeCat = categories.find((c) => c.id === selectedCategory);
    if (!activeCat || activeCat.id === "all") return products;
    return products.filter((p) => matchesCategory(p, activeCat));
  }, [categories, products, selectedCategory]);

  return (
    <>
      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-neutral-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="w-5 h-5 text-neutral-600" />
            <span className="font-work-sans font-medium text-neutral-900">
              {filterLabel}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              const count = categoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className="focus:outline-hidden"
                >
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className={`px-4 py-2 text-sm cursor-pointer transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-white hover:bg-primary/90 shadow-xs"
                        : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{category.name}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {count}
                    </span>
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <PackageOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="font-work-sans font-semibold text-xl text-neutral-800 mb-2">
                {locale === "ar"
                  ? "لا توجد منتجات في هذا التصنيف حالياً"
                  : "No products found in this category"}
              </h3>
              <p className="font-open-sans text-neutral-500 mb-6">
                {locale === "ar"
                  ? "يمكنك استعراض جميع المنتجات المتوفرة أو اختيار فئة أخرى."
                  : "You can browse all available products or select another category."}
              </p>
              <Button
                onClick={() => setSelectedCategory("all")}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {locale === "ar" ? "عرض جميع المنتجات" : "Show All Products"}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                >
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
                          {getCategoryName(product.category, product.categoryId)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-work-sans font-semibold text-xl text-neutral-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="font-open-sans text-neutral-600 mb-4 leading-relaxed h-12 overflow-hidden">
                        {product.description}
                      </p>
                      <Button
                        asChild
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        <Link
                          href={`/${locale}/products/${product.slug}`}
                          className="flex items-center justify-center gap-2"
                        >
                          {viewDetailsLabel}
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
