"use client"

import { useEffect } from "react"
import { useLanguage } from "@/components/language-provider"

export function DirController() {
  const { locale } = useLanguage()

  useEffect(() => {
    if (typeof document !== "undefined") {
      const dir = locale === "ar" ? "rtl" : "ltr"
      document.documentElement.setAttribute("lang", locale)
      document.documentElement.setAttribute("dir", dir)
    }
  }, [locale])

  return null
}
