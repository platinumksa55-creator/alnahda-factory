"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation" // استيراد hook لمعرفة المسار الحالي
import { Button } from "@/components/ui/button"
import { Menu, X, Globe } from "lucide-react"
import { getTranslation, Locale } from "@/lib/i18n" // استيراد أدوات الترجمة
import { SiteSearchModal } from "@/components/site-search-modal"

// 1. المكون الآن يستقبل اللغة كـ prop
export function Navigation({ locale }: { locale: Locale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // 2. إنشاء دالة الترجمة بناءً على اللغة المستلمة
  const t = (key: string) => getTranslation(locale, key)

  // 3. الحصول على المسار الحالي لإعادة توجيه المستخدم عند تغيير اللغة
  const pathname = usePathname()

  const getRedirectedPath = () => {
    if (!pathname) return "/"
    const segments = pathname.split("/")
    segments[1] = locale === "ar" ? "en" : "ar" // تغيير اللغة في الرابط
    return segments.join("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 4. تم تعديل الرابط ليشمل اللغة */}
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/images/al-nahda-logo.png"
              alt="Al-Nahda for Textiles"
              width={40}
              height={40}
              className="w-10 h-10 shrink-0"
            />
            <span className="font-work-sans font-bold text-xl text-primary">{t("companyName")}</span>
          </Link>

          {/* Desktop Navigation - 5. تم تعديل كل الروابط لتشمل اللغة */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-6">
              <Link href={`/${locale}`} className="text-neutral-700 hover:text-primary transition-colors font-medium">
                {t("home")}
              </Link>
              <Link href={`/${locale}/about`} className="text-neutral-700 hover:text-primary transition-colors font-medium">
                {t("about")}
              </Link>
              <Link href={`/${locale}/products`} className="text-neutral-700 hover:text-primary transition-colors font-medium">
                {t("products")}
              </Link>
              <Link href={`/${locale}/contact`} className="text-neutral-700 hover:text-primary transition-colors font-medium">
                {t("contact")}
              </Link>
            </div>

            <div className="h-5 w-px bg-neutral-200" />

            {/* Search Modal Button */}
            <SiteSearchModal locale={locale} />

            {/* 6. تم تحويل زر تبديل اللغة إلى رابط */}
            <Link href={getRedirectedPath()}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent px-3.5"
              >
                <Globe className="w-4 h-4" />
                <span>{t("switchToEnglish")}</span>
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <SiteSearchModal locale={locale} />
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-neutral-200">
              <Link
                href={`/${locale}`}
                className="block px-3 py-2 text-neutral-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                href={`/${locale}/about`}
                className="block px-3 py-2 text-neutral-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("about")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className="block px-3 py-2 text-neutral-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("products")}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="block px-3 py-2 text-neutral-700 hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("contact")}
              </Link>
              <div className="px-3 py-2">
                <Link href={getRedirectedPath()}>
                    <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 bg-transparent"
                    >
                    <Globe className="w-4 h-4" />
                    {t("switchToEnglish")}
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}