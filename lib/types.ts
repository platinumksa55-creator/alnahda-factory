export interface LocalizedString {
  ar: string;
  en: string;
}

export interface LocalizedStringArray {
  ar: string[];
  en: string[];
}

export interface LocalizedRecord {
  ar: Record<string, string>;
  en: Record<string, string>;
}

export interface ProductItem {
  id: number;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  longDescription: LocalizedString;
  category: LocalizedString;
  categoryId: string;
  availability: LocalizedString;
  rating: number;
  reviews: number;
  price?: string;
  images: string[];
  specifications: LocalizedRecord;
  features: LocalizedStringArray;
  applications: LocalizedStringArray;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductCategory {
  id: string;
  name: LocalizedString;
}

export interface VisitRecord {
  id: string;
  timestamp: string;
  visitorId: string;
  path: string;
  referrer: string;
  userAgent: string;
  device: "desktop" | "mobile" | "tablet" | "other";
  browser: string;
  os: string;
  ip?: string;
}

export interface DailyStat {
  total: number;
  unique: number;
  pages: Record<string, number>;
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitorsCount: number;
  visitors: Record<string, { firstSeen: string; lastSeen: string; visitCount: number }>;
  daily: Record<string, DailyStat>;
  pageViews: Record<string, number>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
    other: number;
  };
  browsers: Record<string, number>;
  recentVisits: VisitRecord[];
}

export interface AdminConfig {
  username: string;
  passwordHash: string; // SHA-256 hash
  salt: string;
  siteName: LocalizedString;
  contactPhone: string;
  contactEmail: string;
  contactAddress: LocalizedString;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone: string;
  service?: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}
