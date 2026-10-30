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
  const t = (key: string) => getTranslation(locale, key)

  return {
    title: t("companyName"),
    description: t("footerDescription"),
    icons: {
      icon: '/favicon.ico',
    },
  }
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