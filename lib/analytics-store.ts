import fs from 'fs';
import path from 'path';
import { AnalyticsData, VisitRecord } from './types';

const analyticsFilePath = path.join(process.cwd(), 'data', 'analytics.json');

const defaultAnalytics: AnalyticsData = {
  totalVisits: 0,
  uniqueVisitorsCount: 0,
  visitors: {},
  daily: {},
  pageViews: {},
  devices: { desktop: 0, mobile: 0, tablet: 0, other: 0 },
  browsers: {},
  recentVisits: []
};

export function getRawAnalytics(): AnalyticsData {
  try {
    if (!fs.existsSync(analyticsFilePath)) {
      return defaultAnalytics;
    }
    const content = fs.readFileSync(analyticsFilePath, 'utf-8');
    return JSON.parse(content) as AnalyticsData;
  } catch (error) {
    console.error('Error reading analytics file:', error);
    return defaultAnalytics;
  }
}

export function saveRawAnalytics(data: AnalyticsData): boolean {
  try {
    const dir = path.dirname(analyticsFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(analyticsFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving analytics file:', error);
    return false;
  }
}

// User-Agent detection helper
export function parseUserAgent(uaString: string = '') {
  const ua = uaString.toLowerCase();
  
  // Device
  let device: 'desktop' | 'mobile' | 'tablet' | 'other' = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(ua)) {
    device = 'tablet';
  } else if (/mobi|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(ua)) {
    device = 'mobile';
  }

  // Browser
  let browser = 'Other';
  if (ua.includes('edg/')) browser = 'Edge';
  else if (ua.includes('chrome/') && !ua.includes('edg/')) browser = 'Chrome';
  else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari';
  else if (ua.includes('firefox/')) browser = 'Firefox';
  else if (ua.includes('opr/') || ua.includes('opera/')) browser = 'Opera';

  // OS
  let os = 'Other';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) os = 'iOS';
  else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';

  return { device, browser, os };
}

export function recordVisit(params: {
  visitorId: string;
  path: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
}) {
  // Ignore admin panel paths and internal api calls from polluting visitor stats
  if (!params.path || params.path.startsWith('/admin') || params.path.startsWith('/api')) {
    return;
  }

  const data = getRawAnalytics();
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const nowIso = now.toISOString();

  const { device, browser, os } = parseUserAgent(params.userAgent || '');

  // Check visitor duplicate in the last 2 minutes for the same path
  const lastVisit = data.recentVisits?.[0];
  const isDuplicate =
    lastVisit &&
    lastVisit.visitorId === params.visitorId &&
    lastVisit.path === params.path &&
    Date.now() - new Date(lastVisit.timestamp).getTime() < 2 * 60 * 1000;

  if (isDuplicate) {
    return;
  }

  // Update total visits
  data.totalVisits = (data.totalVisits || 0) + 1;

  // Check unique visitor
  if (!data.visitors) data.visitors = {};
  const isNewVisitor = !data.visitors[params.visitorId];
  if (isNewVisitor) {
    data.uniqueVisitorsCount = (data.uniqueVisitorsCount || 0) + 1;
    data.visitors[params.visitorId] = {
      firstSeen: nowIso,
      lastSeen: nowIso,
      visitCount: 1,
    };
  } else {
    data.visitors[params.visitorId].lastSeen = nowIso;
    data.visitors[params.visitorId].visitCount = (data.visitors[params.visitorId].visitCount || 0) + 1;
  }

  // Daily stats
  if (!data.daily) data.daily = {};
  if (!data.daily[dateStr]) {
    data.daily[dateStr] = {
      total: 0,
      unique: 0,
      pages: {},
    };
  }
  data.daily[dateStr].total += 1;
  if (isNewVisitor || data.visitors[params.visitorId].visitCount === 1) {
    data.daily[dateStr].unique += 1;
  }
  data.daily[dateStr].pages[params.path] = (data.daily[dateStr].pages[params.path] || 0) + 1;

  // Page views
  if (!data.pageViews) data.pageViews = {};
  data.pageViews[params.path] = (data.pageViews[params.path] || 0) + 1;

  // Devices
  if (!data.devices) data.devices = { desktop: 0, mobile: 0, tablet: 0, other: 0 };
  data.devices[device] = (data.devices[device] || 0) + 1;

  // Browsers
  if (!data.browsers) data.browsers = {};
  data.browsers[browser] = (data.browsers[browser] || 0) + 1;

  // Recent visits (store up to 100)
  if (!data.recentVisits) data.recentVisits = [];
  const newVisitRecord: VisitRecord = {
    id: 'v_' + Math.random().toString(36).substring(2, 9),
    timestamp: nowIso,
    visitorId: params.visitorId,
    path: params.path,
    referrer: params.referrer || 'مباشر (Direct)',
    userAgent: params.userAgent || '',
    device,
    browser,
    os,
    ip: params.ip,
  };

  data.recentVisits.unshift(newVisitRecord);
  if (data.recentVisits.length > 100) {
    data.recentVisits = data.recentVisits.slice(0, 100);
  }

  saveRawAnalytics(data);
}

export function getAnalyticsSummary() {
  const data = getRawAnalytics();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const todayStat = data.daily?.[todayStr] || { total: 0, unique: 0, pages: {} };

  // Generate last 14 days chart data
  const chartDays: { date: string; label: string; visits: number; unique: number }[] = [];
  let weeklyTotal = 0;
  let monthlyTotal = 0;

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const stat = data.daily?.[dateKey] || { total: 0, unique: 0, pages: {} };
    
    // Arabic friendly date label (e.g. 16/10)
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    chartDays.push({
      date: dateKey,
      label,
      visits: stat.total,
      unique: stat.unique,
    });

    if (i < 7) weeklyTotal += stat.total;
    monthlyTotal += stat.total;
  }

  // Top pages
  const totalPagesViews = Object.values(data.pageViews || {}).reduce((acc, v) => acc + v, 0) || 1;
  const topPages = Object.entries(data.pageViews || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([pagePath, count]) => {
      let pageTitle = pagePath;
      if (pagePath === '/' || pagePath === '/ar' || pagePath === '/en') pageTitle = 'الصفحة الرئيسية';
      else if (pagePath.includes('/products/')) {
        const slug = pagePath.split('/products/')[1];
        pageTitle = `منتج: ${slug}`;
      } else if (pagePath.includes('/products')) pageTitle = 'كتالوج المنتجات';
      else if (pagePath.includes('/about')) pageTitle = 'من نحن';
      else if (pagePath.includes('/contact')) pageTitle = 'اتصل بنا';

      return {
        path: pagePath,
        title: pageTitle,
        views: count,
        percentage: Math.round((count / totalPagesViews) * 100),
      };
    });

  return {
    totalVisits: data.totalVisits || 0,
    uniqueVisitors: data.uniqueVisitorsCount || Object.keys(data.visitors || {}).length,
    todayVisits: todayStat.total,
    todayUnique: todayStat.unique,
    weeklyVisits: weeklyTotal,
    monthlyVisits: monthlyTotal,
    chartDays,
    topPages,
    devices: data.devices || { desktop: 0, mobile: 0, tablet: 0, other: 0 },
    browsers: data.browsers || {},
    recentVisits: (data.recentVisits || []).slice(0, 30),
  };
}
