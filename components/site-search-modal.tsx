"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Package, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Locale } from "@/lib/i18n";

interface SearchProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  category: string;
  images: string[];
}

interface SiteSearchModalProps {
  locale: Locale;
}

export function SiteSearchModal({ locale }: SiteSearchModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch products on first open
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      setLoading(true);
      fetch(`/api/admin/products`)
        .then((r) => r.json())
        .then((data) => {
          const list = (data.products || []).map((p: any) => ({
            id: p.id,
            slug: p.slug,
            nameAr: p.name?.ar || "",
            nameEn: p.name?.en || "",
            descAr: p.description?.ar || "",
            descEn: p.description?.en || "",
            catAr: p.category?.ar || "",
            catEn: p.category?.en || "",
            name: p.name?.[locale] || p.name?.ar || "",
            description: p.description?.[locale] || p.description?.ar || "",
            category: p.category?.[locale] || p.category?.ar || "",
            images: p.images || ["/placeholder.svg"],
          }));
          setAllProducts(list);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }

    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, locale, allProducts.length]);

  // Filter products by Arabic OR English (both matching)
  const filtered = query.trim()
    ? allProducts.filter((p: any) => {
        const q = query.toLowerCase().trim();
        return (
          p.nameAr?.toLowerCase().includes(q) ||
          p.nameEn?.toLowerCase().includes(q) ||
          p.descAr?.toLowerCase().includes(q) ||
          p.descEn?.toLowerCase().includes(q) ||
          p.catAr?.toLowerCase().includes(q) ||
          p.catEn?.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/${locale}/products/${slug}`);
  };

  return (
    <>
      {/* Search Trigger Button in Header */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-neutral-600 bg-neutral-100/80 hover:bg-neutral-200/80 hover:text-neutral-900 rounded-full transition-all border border-neutral-200/80"
        title={locale === "ar" ? "ابحث عن منتج (Ctrl + K)" : "Search products (Ctrl + K)"}
      >
        <Search className="w-4 h-4 text-neutral-500" />
        <span className="hidden sm:inline">
          {locale === "ar" ? "بحث عن منتج..." : "Search products..."}
        </span>
        <kbd className="hidden md:inline-flex text-[10px] font-sans font-semibold bg-white border border-neutral-300 rounded px-1.5 py-0.5 text-neutral-500">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          {/* Backdrop click to close */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 flex flex-col max-h-[80vh]">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 bg-white">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "ابحث بالعربية أو الإنجليزية (مثال: فوطة فلامنجو، بوليستر، قطن، Towel...)"
                    : "Search in Arabic or English (e.g. Flamingo, Beach, Cotton...)"
                }
                className="flex-1 bg-transparent border-0 outline-hidden text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-neutral-400 hover:text-neutral-600 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-1 rounded-md"
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loading && (
                <div className="py-12 text-center text-neutral-500 flex items-center justify-center gap-2 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span>{locale === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}</span>
                </div>
              )}

              {!loading && query.trim() && filtered.length === 0 && (
                <div className="py-12 text-center text-neutral-500">
                  <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                  <p className="font-semibold text-neutral-800 text-sm">
                    {locale === "ar" ? "لم نجد أي منتجات مطابقة" : "No matching products found"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-1">
                    {locale === "ar" ? "جرّب البحث بكلمة أخرى مثل: قطن، منشفة، فندقي، بحر..." : "Try searching with keywords like towel, cotton, hotel..."}
                  </p>
                </div>
              )}

              {!loading && !query.trim() && (
                <div className="py-8 px-4 text-center">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                    {locale === "ar" ? "عمليات بحث شائعة" : "Popular Searches"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { ar: "فلامنجو", en: "Flamingo" },
                      { ar: "مناشف فندقية", en: "Hotel Towels" },
                      { ar: "شاطئ", en: "Beach Towel" },
                      { ar: "قطن 100%", en: "100% Cotton" },
                      { ar: "وافل مطبخ", en: "Waffle Kitchen" },
                      { ar: "سفينة بحري", en: "Nautical" },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuery(locale === "ar" ? item.ar : item.en)}
                        className="text-xs bg-neutral-100 hover:bg-primary/10 hover:text-primary text-neutral-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {locale === "ar" ? item.ar : item.en}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item.slug)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-neutral-100 cursor-pointer transition-colors group"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-neutral-900 text-sm truncate group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{item.description}</p>
                  </div>
                  {locale === "ar" ? (
                    <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-primary group-hover:-translate-x-1 transition-all shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer Status Bar */}
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-500 flex items-center justify-between">
              <span>
                {query.trim()
                  ? locale === "ar"
                    ? `النتائج (${filtered.length} منتج)`
                    : `Results (${filtered.length} products)`
                  : locale === "ar"
                  ? `إجمالي الموديلات المتاحة: ${allProducts.length}`
                  : `Total available models: ${allProducts.length}`}
              </span>
              <Link
                href={`/${locale}/products`}
                onClick={() => setIsOpen(false)}
                className="text-primary hover:underline font-medium"
              >
                {locale === "ar" ? "تصفح الكتالوج بالكامل ←" : "Browse all catalog →"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
