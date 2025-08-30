"use client"

import type React from "react"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getTranslation, Locale, translations } from "@/lib/i18n"

const icons = { Phone, Mail, MessageCircle, MapPin };

export default function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;

  const t = (key: string) => getTranslation(locale, key);
  const contactInfo = translations[locale]?.contactInfoData || [];
  const workingHours = translations[locale]?.workingHoursData || [];
  const serviceOptions = translations[locale]?.serviceOptionsData || [];

  const [formData, setFormData] = useState({ name: "", email: "", company: "", phone: "", service: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('فشل إرسال الرسالة، يرجى المحاولة مرة أخرى.');
      }

      setIsSubmitted(true);
      setFormData({ name: "", email: "", company: "", phone: "", service: "", message: "" });
      
      setTimeout(() => setIsSubmitted(false), 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      <Navigation locale={locale} />
      
      <section className="relative pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-work-sans font-bold text-4xl lg:text-5xl text-neutral-900 mb-6 text-balance">{t("contactPageTitle")}</h1>
            <p className="font-open-sans text-xl text-neutral-600 max-w-3xl mx-auto text-balance">{t("contactPageSubtitle")}</p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-work-sans font-bold text-2xl lg:text-3xl text-neutral-900 mb-8">{t("contactInfoTitle")}</h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => {
                  const Icon = icons[info.icon as keyof typeof icons] || MapPin;
                  return (
                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4 rtl:space-x-reverse">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><Icon className="w-6 h-6 text-primary" /></div>
                          <div className="flex-1">
                            <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-2">{info.title}</h3>
                            <div className="space-y-1">
                              {info.details.map((detail, idx) => (
                                <p key={idx} className="font-open-sans text-neutral-700">
                                  <a href={info.action} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">{detail}</a>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 rtl:space-x-reverse">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0"><Clock className="w-6 h-6 text-primary" /></div>
                    <div className="flex-1">
                      <h3 className="font-work-sans font-semibold text-lg text-neutral-900 mb-3">{t("workingHoursTitle")}</h3>
                      <div className="space-y-2">
                        {workingHours.map((schedule, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="font-open-sans text-neutral-700">{schedule.day}</span>
                            <span className="font-open-sans font-medium text-neutral-900">{schedule.hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="font-work-sans font-bold text-2xl text-neutral-900 mb-6">{t("formTitle")}</h2>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                      <h3 className="font-work-sans font-semibold text-xl text-neutral-900 mb-2">{t("formSuccessTitle")}</h3>
                      <p className="font-open-sans text-neutral-600">{t("formSuccessMessage")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="font-open-sans font-medium text-neutral-700">{t("formFullNameLabel")}</Label>
                          <Input id="name" name="name" type="text" required value={formData.name} onChange={handleInputChange} className="mt-1" placeholder={t("formFullNamePlaceholder")} />
                        </div>
                        <div>
                          <Label htmlFor="email" className="font-open-sans font-medium text-neutral-700">{t("formEmailLabel")}</Label>
                          <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} className="mt-1" placeholder={t("formEmailPlaceholder")} />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company" className="font-open-sans font-medium text-neutral-700">{t("formCompanyLabel")}</Label>
                          <Input id="company" name="company" type="text" value={formData.company} onChange={handleInputChange} className="mt-1" placeholder={t("formCompanyPlaceholder")} />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="font-open-sans font-medium text-neutral-700">{t("formPhoneLabel")}</Label>
                          <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} className="mt-1" placeholder={t("formPhonePlaceholder")} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="service" className="font-open-sans font-medium text-neutral-700">{t("formServiceLabel")}</Label>
                        <Select onValueChange={handleSelectChange} required>
                          <SelectTrigger className="mt-1"><SelectValue placeholder={t("formServicePlaceholder")} /></SelectTrigger>
                          <SelectContent>
                            {serviceOptions.map((service, index) => (<SelectItem key={index} value={service}>{service}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="message" className="font-open-sans font-medium text-neutral-700">{t("formMessageLabel")}</Label>
                        <Textarea id="message" name="message" required value={formData.message} onChange={handleInputChange} className="mt-1 min-h-32" placeholder={t("formMessagePlaceholder")} />
                      </div>
                      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white">
                        {isSubmitting ? (
                          <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{t("formSubmittingButton")}</div>
                        ) : (
                          <div className="flex items-center gap-2"><Send className="w-4 h-4" />{t("formSubmitButton")}</div>
                        )}
                      </Button>
                      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ---===[ هذا هو قسم الخريطة الصحيح ]===--- */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-work-sans font-bold text-2xl lg:text-3xl text-neutral-900 mb-4">{t("mapTitle")}</h2>
            <p className="font-open-sans text-lg text-neutral-600">{t("mapSubtitle")}</p>
          </div>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardContent className="p-0">
              <a
                href="https://maps.app.goo.gl/CUuT3zoRB1VwbVVr8"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-96 relative"
              >
                <Image
                  src="/images/map-screenshot.png"
                  alt={t("mapInteractive")}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-center text-white bg-black/50 p-4 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">{t("mapInteractive")}</p>
                    <p className="text-sm">{t("mapAddress")}</p>
                  </div>
                </div>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Footer locale={locale} />
    </main>
  )
}