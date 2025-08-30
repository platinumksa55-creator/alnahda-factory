export type Locale = "ar" | "en"

export const defaultLocale: Locale = "ar"
export const locales: Locale[] = ["ar", "en"]

export const translations = {
  ar: {
    // Navigation & Common
    home: "الرئيسية",
    about: "من نحن",
    products: "المنتجات",
    contact: "اتصل بنا",
    switchToEnglish: "English",
    companyName: "النهضة للمنسوجات",
    viewDetails: "عرض التفاصيل",
    allRightsReserved: "جميع الحقوق محفوظة",

    // Homepage
    heroTitle: "الجودة تُنسج في كل خيط",
    heroSubtitle: "نحن نصنع أجود أنواع الأقمشة والمنسوجات بأحدث التقنيات وأعلى معايير الجودة",
    exploreProducts: "اكتشف منتجاتنا",
    contactUs: "تواصل معنا",
    aboutTitle: "تراث من الإبداع والجودة",
    aboutDescription1: "منذ تأسيسنا، نحن ملتزمون بتقديم أجود أنواع الأقمشة التي تجمع بين الحرفية التقليدية والتقنيات الحديثة.",
    aboutDescription2: "فريقنا المتخصص يعمل بشغف لضمان أن كل منتج يحمل بصمة الجودة والتميز التي نشتهر بها.",
    learnMore: "اعرف المزيد عنا",
    featuredTitle: "منتجاتنا المميزة",
    featuredSubtitle: "اكتشف مجموعتنا الواسعة من الأقمشة والمنسوجات عالية الجودة",
    viewAllProducts: "عرض جميع المنتجات",
    ctaTitle: "هل أنت مستعد لبدء مشروعك؟",
    ctaSubtitle: "تواصل معنا اليوم للحصول على استشارة مجانية وعرض أسعار مخصص لاحتياجاتك",
    getQuote: "احصل على عرض أسعار",
    callNow: "اتصل بنا الآن",

    // Footer
    footerDescription: "نحن نصنع أجود أنواع الأقمشة والمنسوجات بأحدث التقنيات وأعلى معايير الجودة. شريكك الموثوق في عالم النسيج.",
    quickLinks: "روابط سريعة",
    contactInfo: "معلومات التواصل",
    contactPhone: "+201222422996",
    contactEmail: "info@alnahdafactory.com",
    contactAddress: "المحلة الكبرى - 2 شارع الحلو - طريق دمرو",
    
    // About Page
    aboutPageTitle: "عن شركتنا",
    aboutPageSubtitle: "رحلة من الشغف والإبداع في عالم النسيج، نسج تراث من الجودة والتميز عبر العقود.",
    ourStoryTitle: "قصتنا",
    ourStoryText1: "بدأت رحلتنا في عام 1999 برؤية واضحة: إنتاج أجود أنواع الأقمشة والمنسوجات التي تجمع بين الحرفية التقليدية والتقنيات الحديثة.",
    ourStoryText2: "نفخر بفريقنا المتخصص من الحرفيين والمهندسين الذين يعملون بشغف لضمان أن كل منتج يحمل بصمة الجودة والتميز التي نشتهر بها.",
    ourStoryText3: "اليوم، نخدم عملاء في أكثر من 15 دولة حول العالم، ونواصل الاستثمار في التطوير والابتكار لنبقى في المقدمة.",
    missionTitle: "رسالتنا",
    missionText: "نسعى لتقديم أجود أنواع الأقمشة التي تلبي احتياجات عملائنا وتتجاوز توقعاتهم، من خلال الجمع بين الخبرة التقليدية والتقنيات المتطورة.",
    visionTitle: "رؤيتنا",
    visionText: "أن نكون الخيار الأول عالميًا في صناعة النسيج، معروفين بالجودة الاستثنائية والابتكار المستمر.",
    valuesTitle: "قيمنا",
    valuesSubtitle: "القيم التي توجه عملنا وتشكل هويتنا كشركة رائدة في صناعة النسيج",
    valueQuality: "الجودة",
    valueQualityDesc: "نلتزم بأعلى معايير الجودة في كل خطوة من خطوات الإنتاج",
    valueInnovation: "الابتكار",
    valueInnovationDesc: "نستثمر في أحدث التقنيات لتطوير منتجات مبتكرة",
    valueReliability: "الموثوقية",
    valueReliabilityDesc: "شريك موثوق يلتزم بالمواعيد ويحافظ على الوعود",
    valueSustainability: "الاستدامة",
    valueSustainabilityDesc: "نحرص على الممارسات المستدامة والصديقة للبيئة",
    ctaAboutTitle: "هل تريد معرفة المزيد؟",
    ctaAboutSubtitle: "تواصل معنا لمعرفة كيف يمكننا مساعدتك في تحقيق أهدافك",
    exploreProductsBtn: "استكشف منتجاتنا",

    // Products Listing Page
    productsPageTitle: "جميع منتجاتنا",
    productsPageSubtitle: "اكتشف مجموعتنا الواسعة من الأقمشة والمنسوجات عالية الجودة المصنوعة بأحدث التقنيات.",
    filterByCategory: "تصفية حسب الفئة:",
    loadMoreProducts: "عرض المزيد من المنتجات",
    productsCtaTitle: "لم تجد ما تبحث عنه؟",
    productsCtaSubtitle: "نحن نقدم حلول مخصصة لاحتياجاتك الخاصة. تواصل معنا لمناقشة متطلباتك.",
    productsCtaQuoteBtn: "طلب عرض أسعار مخصص",
    productsCtaAboutBtn: "تعرف على قدراتنا",

    // Product Detail Page
    productReviews: "تقييم",
    minOrder: "الحد الأدنى",
    availability: "التوفر",
    available: "متوفر",
    keyFeatures: "المميزات الرئيسية",
    specifications: "المواصفات التقنية",
    applications: "الاستخدامات",
    relatedProducts: "منتجات ذات صلة",
    contactExperts: "تواصل مع خبرائنا",
    browseMoreProducts: "تصفح المزيد من المنتجات",
    whatsapp: "واتساب",
    productNotFound: "المنتج غير موجود",
    productDetailCTA: "هل تحتاج مساعدة في الاختيار؟",
    productDetailCTASubtitle: "فريقنا المتخصص جاهز لمساعدتك في اختيار المنتج المناسب لاحتياجاتك",

    productCategories: [
      { id: "all", name: "جميع المنتجات" },
      { id: "cotton", name: "أقمشة القطن" },
      { id: "linen", name: "منسوجات الكتان" },
      { id: "silk", name: "أقمشة الحرير" },
      { id: "blended", name: "منسوجات مخلوطة" },
      { id: "home-decor", name: "أقمشة الديكور" },
      { id: "industrial", name: "منسوجات صناعية" },
    ],
    
    // ALL PRODUCTS DATA (DETAILED)
    allProductsData: [
      { id: 1, slug: "luxury-white-cotton", name: "قماش قطن أبيض فاخر", description: "قماش قطن طبيعي 100% فائق الجودة، مثالي للملابس الراقية.", category: "أقمشة القطن", availability: "متوفر", rating: 4.8, reviews: 24, longDescription: "يتميز هذا القماش القطني الفاخر بنعومته الاستثنائية وجودته العالية. مصنوع من أجود أنواع القطن، يوفر راحة لا مثيل لها.", images: ["/images/luxury-cotton-fabric.png", "/images/luxury-cotton-fabric-2.png", "/images/luxury-cotton-fabric-3.png"], specifications: { "المادة": "100% قطن طبيعي", "الوزن": "180 جم/متر مربع", "العرض": "150 سم" }, features: ["100% قطن طبيعي", "نعومة فائقة", "مقاوم للتجعد"], applications: ["الملابس الراقية", "الفراش", "ملابس الأطفال"] },
      { id: 2, slug: "beige-cotton-towels", name: "مناشف قطنية بلون بيج", description: "مناشف عالية الامتصاص مصنوعة من القطن الطبيعي، توفر المتانة والراحة للاستخدام اليومي.", category: "أقمشة القطن", availability: "متوفر", rating: 4.7, reviews: 18, longDescription: "مناشف قطنية متينة وعملية، مصممة لتحمل الاستخدام المتكرر مع الحفاظ على نعومتها وقدرتها العالية على الامتصاص.", images: ["/images/beige-towel-stack.png", "/images/beige-towel-closeup.png", "/images/beige-towel-in-use.png"], specifications: { "المادة": "100% قطن", "المقاسات": "متوفرة بمقاسات مختلفة" }, features: ["قدرة امتصاص عالية", "متانة للاستخدام اليومي", "ملمس ناعم"], applications: ["الاستخدام المنزلي", "الفنادق والمنتجعات", "النوادي الصحية"] },
      { id: 3, slug: "cotton-bornooses", name: "برانس قطنية فاخرة", description: "برانس قطنية فاخرة للرجال والنساء، توفر نعومة طبيعية ودفء وراحة للمنزل.", category: "أقمشة القطن", availability: "متوفر", rating: 4.9, reviews: 32, longDescription: "استمتع بالراحة الفائقة مع برانس مصنوعة من القطن الصافي، مثالية بعد الاستحمام أو للاسترخاء في المنزل.", images: ["/images/cotton-bornoos-white.png", "/images/cotton-bornoos-detail.png", "/images/cotton-bornoos-on-model.png"], specifications: { "المادة": "100% قطن تيري", "الأحجام": "S, M, L, XL, XXL" }, features: ["نعومة وراحة", "تصميم أنيق", "امتصاص عالي"], applications: ["ملابس منزلية", "روب استحمام", "هدايا فاخرة"] },
      { id: 4, slug: "small-cotton-towels", name: "مناشف قطنية صغيرة فاخرة", description: "مناشف قطنية صغيرة وعملية، مثالية للاستخدامات المتعددة مثل مناشف اليد أو الوجه.", category: "أقمشة القطن", availability: "متوفر", rating: 4.5, reviews: 45, longDescription: "مجموعة من المناشف الصغيرة المصنوعة من القطن عالي الجودة لضمان الامتصاص والنعومة. حجمها مثالي يجعلها متعددة الاستخدامات وعملية.", images: ["/images/small-towel-set.png", "/images/small-towel-folded.png", "/images/small-towel-bathroom.png"], specifications: { "المادة": "100% قطن", "المقاسات": "30x30 سم, 50x30 سم" }, features: ["حجم عملي", "متعددة الاستخدامات", "نعومة فائقة"], applications: ["مناشف للضيوف", "مناشف اليد والوجه", "المطابخ"] },
      { id: 5, slug: "luxury-cotton-bed-sheets", name: "أطقم ملاءات سرير قطنية فاخرة", description: "طقم ملاءات سرير أنيق مصنوع من القطن الطبيعي 100%، مصمم للراحة والجودة طويلة الأمد.", category: "أقمشة الديكور", availability: "متوفر", rating: 4.8, reviews: 29, longDescription: "جدد غرفة نومك مع أطقم الملاءات الفاخرة التي توفر نومًا هانئًا بفضل جودة القطن الطبيعي وقدرته على التنفس.", images: ["/images/bed-sheets-set.png", "/images/bed-sheets-closeup.png", "/images/bed-sheets-on-bed.png"], specifications: { "المادة": "100% قطن ساتين", "المقاسات": "مفرد، مزدوج، كينج" }, features: ["ملمس ناعم وحريري", "تهوية عالية", "جودة تدوم طويلاً"], applications: ["غرف النوم الرئيسية", "أجنحة الفنادق الفاخرة", "هدايا الزفاف"] },
      { id: 6, slug: "technical-cotton-fabric", name: "أقمشة قطنية تقنية", description: "قماش قطني متخصص للاستخدامات التقنية والصناعية، يجمع بين المرونة والنعومة الطبيعية.", category: "منسوجات صناعية", availability: "متوفر", rating: 4.9, reviews: 15, longDescription: "نقدم أقمشة قطنية معالجة بتقنيات خاصة لتلبية متطلبات محددة مثل مقاومة الماء أو اللهب، مع الحفاظ على خصائص القطن الطبيعية.", images: ["/images/technical-fabric-roll.png", "/images/technical-fabric-closeup.png", "/images/technical-fabric-application.png"], specifications: { "المعالجة": "مقاومة للماء أو اللهب (حسب الطلب)", "المادة": "100% قطن" }, features: ["معالجة خاصة", "متانة عالية", "نعومة طبيعية"], applications: ["ملابس العمل الواقية", "المنسوجات الطبية", "الفلاتر الصناعية"] },
      { id: 7, slug: "organic-natural-cotton", name: "قطن طبيعي عضوي (صديق للبيئة)", description: "قماش قطني عضوي نقي، مزروع بدون كيماويات. مثالي للبشرة الحساسة ومنتجات الأطفال.", category: "أقمشة القطن", availability: "متوفر", rating: 4.9, reviews: 38, longDescription: "قطن مزروع بدون مبيدات أو مواد كيميائية ضارة. مثالي لملابس الأطفال والمنتجات التي تلامس البشرة مباشرة.", images: ["/images/organic-cotton-bale.png", "/images/organic-cotton-fabric.png", "/images/organic-cotton-shirt.png"], specifications: { "المادة": "100% قطن عضوي معتمد", "الوزن": "160 جم/متر مربع" }, features: ["عضوي معتمد", "خالي من الكيماويات", "صحي وآمن"] },
      { id: 8, slug: "naturally-dyed-cotton-towels", name: "مناشف القطن المصبوغ طبيعياً", description: "مناشف ناعمة مصبوغة بألوان مستخرجة من مصادر نباتية طبيعية، صديقة للبيئة.", category: "أقمشة القطن", availability: "متوفر", rating: 4.8, reviews: 22, longDescription: "يتم استخدام أصباغ مستخرجة من النباتات والمعادن الطبيعية لصبغ هذا الكتان، مما يجعله خيارًا مستدامًا وجميلًا.", images: ["/images/natural-dye-towels.png", "/images/natural-dye-colors.png", "/images/natural-dye-process.png"], specifications: { "المادة": "100% قطن", "الصبغة": "طبيعية" }, features: ["صبغات طبيعية", "ألوان ثابتة", "صديق للبيئة"] },
      { id: 9, slug: "ihram-clothing-for-muslims", name: "ملابس إحرام قطنية", description: "ملابس إحرام مريحة مصنوعة من قطن عالي الجودة لضمان الراحة التامة أثناء أداء مناسك الحج والعمرة.", category: "أقمشة القطن", availability: "متوفر", rating: 4.9, reviews: 41, longDescription: "طقم إحرام للرجال مكون من قطعتين غير مخيطتين، مصنوع من قطن 100% عالي الامتصاص ومريح للبشرة.", images: ["/images/ihram-clothing-folded.png", "/images/ihram-clothing-on-model.png", "/images/ihram-clothing-texture.png"], specifications: { "المادة": "100% قطن", "المقاس": "مقاس موحد" }, features: ["قطن عالي الامتصاص", "مريح للبشرة", "بدون خياطة"], applications: ["مناسك الحج", "مناسك العمرة"] },
    ],
    
    // Contact Page
    contactPageTitle: "تواصل معنا",
    contactPageSubtitle: "نحن هنا لمساعدتك. تواصل معنا للحصول على استشارة مجانية أو عرض أسعار مخصص",
    contactInfoTitle: "معلومات التواصل",
    workingHoursTitle: "ساعات العمل",
    formTitle: "أرسل لنا رسالة",
    formSuccessTitle: "تم إرسال الرسالة!",
    formSuccessMessage: "شكراً لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.",
    formFullNameLabel: "الاسم الكامل *",
    formFullNamePlaceholder: "أدخل اسمك الكامل",
    formEmailLabel: "البريد الإلكتروني *",
    formEmailPlaceholder: "example@email.com",
    formCompanyLabel: "اسم الشركة",
    formCompanyPlaceholder: "اسم شركتك (اختياري)",
    formPhoneLabel: "رقم الهاتف *",
    formPhonePlaceholder: "+201222422996",
    formServiceLabel: "الخدمة المطلوبة *",
    formServicePlaceholder: "اختر الخدمة المطلوبة",
    formMessageLabel: "الرسالة *",
    formMessagePlaceholder: "اكتب رسالتك هنا... أخبرنا عن احتياجاتك ومتطلباتك",
    formSubmitButton: "إرسال الرسالة",
    formSubmittingButton: "جاري الإرسال...",
    mapTitle: "موقعنا",
    mapSubtitle: "زورنا في مصنعنا الواقع في قلب المنطقة الصناعية",
    mapInteractive: "خريطة تفاعلية",
    mapAddress: "المحلة الكبرى - 2 شارع الحلو - طريق دمرو",
    contactCtaTitle: "تحتاج مساعدة فورية؟",
    contactCtaSubtitle: "فريقنا متاح للرد على استفساراتك وتقديم المساعدة الفورية",
    contactCtaCallNow: "اتصل الآن",
    
    contactInfoData: [
      { icon: "Phone", title: "الهاتف", details: ["+201222422996"], action: "tel:+201222422996" },
      { icon: "Mail", title: "البريد الإلكتروني", details: ["info@alnahdafactory.com", "sales@alnahdafactory.com"], action: "mailto:info@alnahdafactory.com" },
      { icon: "MessageCircle", title: "واتساب", details: ["+201222422996"], action: "https://wa.me/201222422996" },
      { icon: "MapPin", title: "العنوان", details: ["المحلة الكبرى", "2 شارع الحلو - طريق دمرو"], action: "https://maps.google.com" },
    ],
    
    workingHoursData: [
      { day: "الأحد - الخميس", hours: "8:00 ص - 6:00 م" },
      { day: "الجمعة", hours: "مغلق" },
      { day: "السبت", hours: "9:00 ص - 2:00 م" },
    ],

    serviceOptionsData: [
      "أقمشة القطن", "منسوجات الكتان", "أقمشة الحرير", "منسوجات مخلوطة",
      "أقمشة الديكور المنزلي", "منسوجات صناعية", "طلب مخصص", "استشارة تقنية",
    ],
  },
  en: {
    // Navigation & Common
    home: "Home",
    about: "About Us",
    products: "Products",
    contact: "Contact Us",
    switchToEnglish: "العربية",
    companyName: "Al-Nahda for Textiles",
    viewDetails: "View Details",
    allRightsReserved: "All Rights Reserved",

    // Homepage
    heroTitle: "Quality Woven into Every Thread",
    heroSubtitle: "We manufacture the finest fabrics and textiles using the latest technologies and highest quality standards.",
    exploreProducts: "Explore Our Products",
    contactUs: "Contact Us",
    aboutTitle: "A Heritage of Creativity and Quality",
    aboutDescription1: "Since our establishment, we've been committed to providing the finest fabrics that blend traditional craftsmanship with modern tech.",
    aboutDescription2: "Our specialized team works passionately to ensure every product carries the mark of quality and excellence we're known for.",
    learnMore: "Learn More About Us",
    featuredTitle: "Our Featured Products",
    featuredSubtitle: "Discover our wide range of high-quality fabrics and textiles.",
    viewAllProducts: "View All Products",
    ctaTitle: "Ready to Start Your Project?",
    ctaSubtitle: "Contact us today for a free consultation and a custom quote tailored to your needs.",
    getQuote: "Get a Quote",
    callNow: "Call Us Now",

    // Footer
    footerDescription: "We manufacture the finest fabrics and textiles using the latest technologies and highest quality standards. Your trusted partner in the world of textiles.",
    quickLinks: "Quick Links",
    contactInfo: "Contact Information",
    contactPhone: "+201222422996",
    contactEmail: "info@alnahdafactory.com",
    contactAddress: "EL-Mahalla EL Kobra, 2 AL-Halou St, Damro Road",
    
    // About Page
    aboutPageTitle: "About Our Company",
    aboutPageSubtitle: "A journey of passion and creativity in the world of textiles, weaving a legacy of quality and excellence.",
    ourStoryTitle: "Our Story",
    ourStoryText1: "Our journey began in 1999 with a clear vision: to produce the finest fabrics and textiles that combine traditional craftsmanship with modern technologies.",
    ourStoryText2: "We are proud of our specialized team of artisans and engineers who work passionately to ensure that every product carries the mark of quality and excellence we are known for.",
    ourStoryText3: "Today, we serve clients in over 15 countries worldwide, and we continue to invest in development and innovation to stay at the forefront.",
    missionTitle: "Our Mission",
    missionText: "To provide the finest fabrics and textiles that meet our clients' needs and exceed their expectations, by combining traditional expertise with advanced technologies.",
    visionTitle: "Our Vision",
    visionText: "To be the first choice globally in the textile industry, known for exceptional quality and continuous innovation.",
    valuesTitle: "Our Values",
    valuesSubtitle: "The values that guide our work and shape our identity as a leading company in the textile industry.",
    valueQuality: "Quality",
    valueQualityDesc: "We adhere to the highest quality standards in every step of production.",
    valueInnovation: "Innovation",
    valueInnovationDesc: "We invest in the latest technologies to develop innovative products.",
    valueReliability: "Reliability",
    valueReliabilityDesc: "A trusted partner who adheres to deadlines and keeps promises.",
    valueSustainability: "Sustainability",
    valueSustainabilityDesc: "We are committed to sustainable and environmentally friendly practices.",
    ctaAboutTitle: "Want to know more?",
    ctaAboutSubtitle: "Contact us to find out how we can help you achieve your goals.",
    exploreProductsBtn: "Explore Our Products",

    // Products Listing Page
    productsPageTitle: "All Our Products",
    productsPageSubtitle: "Discover our wide range of high-quality fabrics and textiles manufactured with the latest technologies.",
    filterByCategory: "Filter by Category:",
    loadMoreProducts: "Load More Products",
    productsCtaTitle: "Didn't find what you're looking for?",
    productsCtaSubtitle: "We offer custom solutions for your specific needs. Contact us to discuss your requirements.",
    productsCtaQuoteBtn: "Request a Custom Quote",
    productsCtaAboutBtn: "Learn About Our Capabilities",

    // Product Detail Page
    productReviews: "Reviews",
    minOrder: "Min. Order",
    availability: "Availability",
    available: "Available",
    keyFeatures: "Key Features",
    specifications: "Technical Specifications",
    applications: "Applications",
    relatedProducts: "Related Products",
    contactExperts: "Contact Our Experts",
    browseMoreProducts: "Browse More Products",
    whatsapp: "WhatsApp",
    productNotFound: "Product Not Found",
    productDetailCTA: "Need Help Choosing?",
    productDetailCTASubtitle: "Our specialized team is ready to help you choose the right product for your needs.",

    productCategories: [
      { id: "all", name: "All Products" },
      { id: "cotton", name: "Cotton Fabrics" },
      { id: "linen", name: "Linen Textiles" },
      { id: "silk", name: "Silk Fabrics" },
      { id: "blended", name: "Blended Textiles" },
      { id: "home-decor", name: "Decor Fabrics" },
      { id: "industrial", name: "Industrial Textiles" },
    ],

    // ALL PRODUCTS DATA (DETAILED)
    allProductsData: [
      { id: 1, slug: "luxury-white-cotton", name: "Luxury White Cotton Fabric", description: "Premium 100% natural cotton fabric with a soft, breathable texture—ideal for elegant apparel and fine textiles.", category: "Cotton Fabrics", availability: "Available", rating: 4.8, reviews: 24, longDescription: "This luxury cotton fabric features exceptional softness and high quality. Made from the finest cotton, it provides unparalleled comfort.", images: ["/images/luxury-cotton-fabric.png", "/images/luxury-cotton-fabric-2.png", "/images/luxury-cotton-fabric-3.png"], specifications: { "Material": "100% Natural Cotton", "Weight": "180 g/m²" }, features: ["100% Natural Cotton", "Ultra Soft", "Wrinkle Resistant"], applications: ["Fine Apparel", "Bedding", "Children's Wear"] },
      { id: 2, slug: "beige-cotton-towels", name: "Beige Cotton Towels", description: "High-absorbency towels made from natural beige cotton, offering durability and comfort for everyday use.", category: "Cotton Fabrics", availability: "Available", rating: 4.7, reviews: 18, longDescription: "Durable and practical cotton towels, designed to withstand frequent use while maintaining their softness and high absorbency.", images: ["/images/beige-towel-stack.png", "/images/beige-towel-closeup.png", "/images/beige-towel-in-use.png"], specifications: { "Material": "100% Cotton", "Sizes": "Various sizes available" }, features: ["High Absorbency", "Durable for Daily Use", "Soft Texture"], applications: ["Home Use", "Hotels & Resorts", "Health Clubs"] },
      { id: 3, slug: "cotton-bornooses", name: "Cotton Bornooses", description: "Luxury cotton bornooses for men and women, providing natural softness, warmth, and comfort for home and leisure.", category: "Cotton Fabrics", availability: "Available", rating: 4.9, reviews: 32, longDescription: "Enjoy superior comfort with our pure cotton bornooses, perfect for after a bath or for relaxing at home.", images: ["/images/cotton-bornoos-white.png", "/images/cotton-bornoos-detail.png", "/images/cotton-bornoos-on-model.png"], specifications: { "Material": "100% Terry Cotton", "Sizes": "S, M, L, XL, XXL" }, features: ["Softness and Comfort", "Elegant Design", "High Absorbency"], applications: ["Loungewear", "Bathrobe", "Luxury Gifts"] },
      { id: 4, slug: "small-cotton-towels", name: "Luxury Small Cotton Towels", description: "Practical and compact luxury cotton towels, perfect for multiple uses like hand towels, face cloths, or guest towels.", category: "Cotton Fabrics", availability: "Available", rating: 4.5, reviews: 45, longDescription: "A set of small towels made from high-quality cotton to ensure absorbency and softness. Their perfect size makes them versatile and practical.", images: ["/images/small-towel-set.png", "/images/small-towel-folded.png", "/images/small-towel-bathroom.png"], specifications: { "Material": "100% Cotton", "Sizes": "30x30 cm, 50x30 cm" }, features: ["Practical Size", "Multi-purpose", "Ultra Soft"], applications: ["Guest towels", "Hand and face towels", "Kitchens"] },
      { id: 5, slug: "luxury-cotton-bed-sheets", name: "Luxury Cotton Bed Sheets", description: "Elegant bed sheet set made of 100% natural cotton, designed for comfort, breathability, and long-lasting quality.", category: "Decor Fabrics", availability: "Available", rating: 4.8, reviews: 29, longDescription: "Refresh your bedroom with our luxury bed sheet sets that provide a restful sleep thanks to the quality of natural, breathable cotton.", images: ["/images/bed-sheets-set.png", "/images/bed-sheets-closeup.png", "/images/bed-sheets-on-bed.png"], specifications: { "Material": "100% Sateen Cotton", "Sizes": "Single, Double, King" }, features: ["Soft and Silky Feel", "High Breathability", "Long-lasting Quality"], applications: ["Master Bedrooms", "Luxury Hotel Suites", "Wedding Gifts"] },
      { id: 6, slug: "technical-cotton-fabric", name: "Technical Cotton Fabric", description: "Specialized cotton fabric for technical and industrial uses, combining resilience with natural softness.", category: "Industrial Textiles", availability: "Available", rating: 4.9, reviews: 15, longDescription: "We offer cotton fabrics treated with special technologies to meet specific requirements such as water or flame resistance, while maintaining the natural properties of cotton.", images: ["/images/technical-fabric-roll.png", "/images/technical-fabric-closeup.png", "/images/technical-fabric-application.png"], specifications: { "Treatment": "Water or Flame Resistant (on-demand)", "Material": "100% Cotton" }, features: ["Special Treatment", "High Durability", "Natural Softness"], applications: ["Protective Workwear", "Medical Textiles", "Industrial Filters"] },
      { id: 7, slug: "organic-natural-cotton", name: "Organic Natural Cotton Fabric", description: "Eco-friendly, chemical-free organic cotton fabric—gentle on skin and sustainably produced for premium quality textiles.", category: "Cotton Fabrics", availability: "Available", rating: 4.9, reviews: 38, longDescription: "Cotton grown without harmful pesticides or chemicals. Perfect for baby clothes and products that come into direct contact with the skin.", images: ["/images/organic-cotton-bale.png", "/images/organic-cotton-fabric.png", "/images/organic-cotton-shirt.png"], specifications: { "Material": "100% Certified Organic Cotton", "Weight": "160 g/m²" }, features: ["Certified Organic", "Chemical-Free", "Healthy and Safe"] },
      { id: 8, slug: "naturally-dyed-cotton-towels", name: "Naturally Dyed Cotton Towels", description: "Pure cotton towels naturally dyed in earthy tones, combining eco-conscious design with softness and absorbency.", category: "Cotton Fabrics", availability: "Available", rating: 4.8, reviews: 22, longDescription: "Dyes extracted from natural plants and minerals are used to color this linen, making it a beautiful and sustainable choice.", images: ["/images/natural-dye-towels.png", "/images/natural-dye-colors.png", "/images/natural-dye-process.png"], specifications: { "Material": "100% Cotton", "Dye": "Natural" }, features: ["Natural Dyes", "Colorfast", "Eco-Friendly"] },
      { id: 9, slug: "ihram-clothing-for-muslims", name: "Cotton Ihram Clothing", description: "Comfortable Ihram clothing made from high-quality cotton to ensure complete comfort during Hajj and Umrah rituals.", category: "Cotton Fabrics", availability: "Available", rating: 4.9, reviews: 41, longDescription: "A two-piece, unstitched Ihram set for men, made from 100% high-absorbency cotton that is comfortable on the skin.", images: ["/images/ihram-clothing-folded.png", "/images/ihram-clothing-on-model.png", "/images/ihram-clothing-texture.png"], specifications: { "Material": "100% Cotton", "Size": "One size fits all" }, features: ["High-Absorbency Cotton", "Comfortable on Skin", "Unstitched"], applications: ["Hajj Rituals", "Umrah Rituals"] },
    ],

    contactPageTitle: "Contact Us",
    contactPageSubtitle: "We are here to help. Contact us for a free consultation or a custom quote.",
    contactInfoTitle: "Contact Information",
    workingHoursTitle: "Working Hours",
    formTitle: "Send us a message",
    formSuccessTitle: "Message Sent!",
    formSuccessMessage: "Thank you for contacting us. We will get back to you as soon as possible.",
    formFullNameLabel: "Full Name *",
    formFullNamePlaceholder: "Enter your full name",
    formEmailLabel: "Email Address *",
    formEmailPlaceholder: "example@email.com",
    formCompanyLabel: "Company Name",
    formCompanyPlaceholder: "Your company name (optional)",
    formPhoneLabel: "Phone Number *",
    formPhonePlaceholder: "+201222422996",
    formServiceLabel: "Required Service *",
    formServicePlaceholder: "Select the required service",
    formMessageLabel: "Message *",
    formMessagePlaceholder: "Write your message here... Tell us about your needs and requirements.",
    formSubmitButton: "Send Message",
    formSubmittingButton: "Sending...",
    mapTitle: "Our Location",
    mapSubtitle: "Visit us at our factory located in the heart of the industrial area.",
    mapInteractive: "Interactive Map",
    mapAddress: "EL-Mahalla EL Kobra, 2 AL-Halou St, Damro Road",
    contactCtaTitle: "Need immediate help?",
    contactCtaSubtitle: "Our team is available to answer your inquiries and provide immediate assistance.",
    contactCtaCallNow: "Call Now",

    contactInfoData: [
      { icon: "Phone", title: "Phone", details: ["+201222422996"], action: "tel:+201222422996" },
      { icon: "Mail", title: "Email", details: ["info@alnahdafactory.com", "sales@alnahdafactory.com"], action: "mailto:info@alnahdafactory.com" },
      { icon: "MessageCircle", title: "WhatsApp", details: ["+201222422996"], action: "https://wa.me/201222422996" },
      { icon: "MapPin", title: "Address", details: ["EL-Mahalla EL Kobra", "2 AL-Halou St, Damro Road"], action: "https://maps.google.com" },
    ],

    workingHoursData: [
      { day: "Sunday - Thursday", hours: "8:00 AM - 6:00 PM" },
      { day: "Friday", hours: "Closed" },
      { day: "Saturday", hours: "9:00 AM - 2:00 PM" },
    ],

    serviceOptionsData: [
      "Cotton Fabrics", "Linen Textiles", "Silk Fabrics", "Blended Textiles",
      "Home Decor Fabrics", "Industrial Textiles", "Custom Order", "Technical Consultation",
    ],
  },
}

// The getTranslation function remains the same
export function getTranslation(locale: Locale, key: string): any {
  const keys = key.split(".")
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key
    }
  }
  return value || key
}