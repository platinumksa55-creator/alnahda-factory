import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Work_Sans, Open_Sans } from "next/font/google"
import "../globals.css"
import { Locale, getTranslation } from "@/lib/i18n" 
import { VisitorTracker } from "@/components/visitor-tracker" 

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  const siteUrl = "https://alnahda-factory-delta.vercel.app";

  const title = isAr
    ? "مصنع النهضة للمنسوجات | أجود المفروشات والمناشف القطنية بالمحلة الكبرى"
    : "Al-Nahda Textile Factory | Premium Egyptian Cotton Towels & Linens";

  const description = isAr
    ? "مصنع النهضة للمنسوجات بالمحلة الكبرى - متخصصون في صناعة وتوريد وتصدير أفخر المناشف القطنية الفندقية والشاطئية، وبرانس الحمام، والمفروشات بجودة عالمية وأسعار جملة منافسة."
    : "Al-Nahda Textile Factory in El-Mahalla El-Kubra - Leaders in manufacturing, wholesale, and export of premium hotel bath towels, beach towels, velour robes, and luxury Egyptian cotton textiles.";

  const keywords = isAr
    ? [
        "مصنع منسوجات",
        "مصنع فوط بالمحلة الكبرى",
        "مناشف قطنية",
        "مناشف فندقية",
        "مناشف شاطئ",
        "تصدير مفروشات مصرية",
        "قطن مصري 100%",
        "مصنع النهضة",
        "توريد مناشف فنادق",
        "فوط مطبخ قطن",
      ]
    : [
        "Textile Factory Egypt",
        "El Mahalla Towel Manufacturer",
        "Egyptian Cotton Towels",
        "Hotel Bath Towels Wholesale",
        "Beach Towels Supplier",
        "Luxury Velour Towels",
        "Al Nahda Textiles",
      ];

  return {
    title: {
      default: title,
      template: isAr ? "%s | مصنع النهضة للمنسوجات" : "%s | Al-Nahda Textile Factory",
    },
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        ar: `${siteUrl}/ar`,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}`,
      siteName: isAr ? "مصنع النهضة للمنسوجات" : "Al-Nahda Textiles",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
      images: [
        {
          url: "/images/al-nahda-logo.png",
          width: 500,
          height: 500,
          alt: isAr ? "لوجو مصنع النهضة للمنسوجات" : "Al-Nahda Textile Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/al-nahda-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/images/al-nahda-logo.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${workSans.variable} ${openSans.variable} antialiased`}
      >
        <VisitorTracker />
        {children}
      </body>
    </html>
  )
}