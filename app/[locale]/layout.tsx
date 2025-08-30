import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Work_Sans, Open_Sans } from "next/font/google"
import "../globals.css"
import { Locale, getTranslation } from "@/lib/i18n" 

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

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const { locale } = params; // تم حل التحذير هنا
  const t = (key: string) => getTranslation(locale, key)

  return {
    title: t("companyName"),
    description: t("footerDescription"),
    // ---===[ تم إضافة هذا الجزء ]===---
    icons: {
      icon: '/favicon.ico', // المسار إلى الأيقونة
    },
    // ---=======================---
  }
}

// ---===[ تم تعديل هذا الجزء لحل التحذير ]===---
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: Locale }
}) {
  const { locale } = params; // تم نقل هذا السطر إلى هنا

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${workSans.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}