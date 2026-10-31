import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { getTranslation, Locale } from "@/lib/i18n";

export function Footer({ locale }: { locale: Locale }) {
  const t = (key: string) => getTranslation(locale, key);

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/al-nahda-logo.png"
                alt={t("companyName")}
                width={40}
                height={40}
                className="w-10 h-10 shrink-0"
              />
              <span className="font-work-sans font-bold text-xl">{t("companyName")}</span>
            </div>
            <p className="font-open-sans text-neutral-300 mb-6 leading-relaxed max-w-md">{t("footerDescription")}</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-work-sans font-semibold text-lg mb-4">{t("quickLinks")}</h3>
            <ul className="space-y-2">
              <li><Link href={`/${locale}`} className="font-open-sans text-neutral-300 hover:text-white transition-colors">{t("home")}</Link></li>
              <li><Link href={`/${locale}/about`} className="font-open-sans text-neutral-300 hover:text-white transition-colors">{t("about")}</Link></li>
              <li><Link href={`/${locale}/products`} className="font-open-sans text-neutral-300 hover:text-white transition-colors">{t("products")}</Link></li>
              <li><Link href={`/${locale}/contact`} className="font-open-sans text-neutral-300 hover:text-white transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* Contact Info - ---===[ تم تعديل هذا الجزء ]===--- */}
          <div>
            <h3 className="font-work-sans font-semibold text-lg mb-4">{t("contactInfo")}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                {/* تم استبدال النص الثابت بدالة الترجمة */}
                <span className="font-open-sans text-neutral-300" dir="ltr">{t("contactPhone")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                {/* تم استبدال النص الثابت بدالة الترجمة */}
                <span className="font-open-sans text-neutral-300">{t("contactEmail")}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                {/* تم استبدال النص الثابت بدالة الترجمة */}
                <span className="font-open-sans text-neutral-300">{t("contactAddress")}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-400 text-sm">
          <p className="font-open-sans">
            © {new Date().getFullYear()} {t("companyName")}. {t("allRightsReserved")}.
          </p>
          <Link
            href="/admin"
            className="text-neutral-500 hover:text-neutral-300 transition-colors mt-2 sm:mt-0 text-xs flex items-center gap-1"
          >
            <span>لوحة التحكم (Admin)</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}