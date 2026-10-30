import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { bulkImportProducts } from '@/lib/products-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';
import * as XLSX from 'xlsx';
import { ProductItem } from '@/lib/types';

const CATEGORY_MAP: Record<string, { id: string; ar: string; en: string }> = {
  cotton: { id: 'cotton', ar: 'أقمشة القطن', en: 'Cotton Fabrics' },
  'أقمشة القطن': { id: 'cotton', ar: 'أقمشة القطن', en: 'Cotton Fabrics' },
  قطن: { id: 'cotton', ar: 'أقمشة القطن', en: 'Cotton Fabrics' },
  linen: { id: 'linen', ar: 'منسوجات الكتان', en: 'Linen Textiles' },
  'منسوجات الكتان': { id: 'linen', ar: 'منسوجات الكتان', en: 'Linen Textiles' },
  كتان: { id: 'linen', ar: 'منسوجات الكتان', en: 'Linen Textiles' },
  silk: { id: 'silk', ar: 'أقمشة الحرير', en: 'Silk Fabrics' },
  'أقمشة الحرير': { id: 'silk', ar: 'أقمشة الحرير', en: 'Silk Fabrics' },
  حرير: { id: 'silk', ar: 'أقمشة الحرير', en: 'Silk Fabrics' },
  blended: { id: 'blended', ar: 'منسوجات مخلوطة', en: 'Blended Textiles' },
  'منسوجات مخلوطة': { id: 'blended', ar: 'منسوجات مخلوطة', en: 'Blended Textiles' },
  مخلوط: { id: 'blended', ar: 'منسوجات مخلوطة', en: 'Blended Textiles' },
  'home-decor': { id: 'home-decor', ar: 'أقمشة الديكور', en: 'Decor Fabrics' },
  'أقمشة الديكور': { id: 'home-decor', ar: 'أقمشة الديكور', en: 'Decor Fabrics' },
  ديكور: { id: 'home-decor', ar: 'أقمشة الديكور', en: 'Decor Fabrics' },
  industrial: { id: 'industrial', ar: 'منسوجات صناعية', en: 'Industrial Textiles' },
  'منسوجات صناعية': { id: 'industrial', ar: 'منسوجات صناعية', en: 'Industrial Textiles' },
  صناعي: { id: 'industrial', ar: 'منسوجات صناعية', en: 'Industrial Textiles' },
};

function resolveCategory(rawVal?: string): { id: string; ar: string; en: string } {
  if (!rawVal) return CATEGORY_MAP.cotton;
  const val = rawVal.trim().toLowerCase();
  if (CATEGORY_MAP[val]) return CATEGORY_MAP[val];

  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (val.includes(key) || cat.ar.includes(val) || cat.en.toLowerCase().includes(val)) {
      return cat;
    }
  }
  return CATEGORY_MAP.cotton;
}

function getColumnValue(row: Record<string, any>, possibleKeys: string[]): string {
  const rowKeys = Object.keys(row);
  for (const pk of possibleKeys) {
    const normalizedPk = pk.trim().toLowerCase();
    const matchedKey = rowKeys.find(
      rk => rk.trim().toLowerCase() === normalizedPk || rk.trim().toLowerCase().includes(normalizedPk)
    );
    if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
      return String(row[matchedKey]).trim();
    }
  }
  return '';
}

function parseRowToProduct(row: Record<string, any>): Partial<ProductItem> | null {
  const nameAr = getColumnValue(row, [
    'اسم الموديل (عربي)',
    'اسم الموديل',
    'الاسم بالعربي',
    'اسم المنتج',
    'الاسم',
    'name_ar',
    'name (ar)',
    'arabic name',
    'model name',
    'name',
    'title',
  ]);

  const nameEn = getColumnValue(row, [
    'اسم الموديل (إنجليزي)',
    'اسم الموديل بالانجليزي',
    'الاسم بالإنجليزي',
    'name_en',
    'name (en)',
    'english name',
  ]);

  if (!nameAr && !nameEn) {
    return null;
  }

  const descAr = getColumnValue(row, [
    'الوصف المختصر (عربي)',
    'الوصف المختصر',
    'وصف مختصر',
    'الوصف',
    'الدسكربشن',
    'التعريف المختصر',
    'description_ar',
    'description',
    'short_description',
    'desc',
  ]);

  const descEn = getColumnValue(row, [
    'الوصف المختصر (إنجليزي)',
    'وصف انجليزي',
    'description_en',
    'english description',
  ]);

  const longDescAr = getColumnValue(row, [
    'التعريف الكامل (عربي)',
    'التعريف الكامل',
    'الوصف التفصيلي',
    'الوصف الكامل',
    'تفاصيل المنتج',
    'long_description_ar',
    'long_description',
    'full_description',
    'details',
  ]);

  const longDescEn = getColumnValue(row, [
    'التعريف الكامل (إنجليزي)',
    'long_description_en',
  ]);

  const rawCategory = getColumnValue(row, [
    'التصنيف',
    'الفئة',
    'القسم',
    'category',
    'category_id',
  ]);
  const cat = resolveCategory(rawCategory);

  const availabilityRaw = getColumnValue(row, [
    'حالة التوفر',
    'التوفر',
    'الحالة',
    'availability',
    'status',
  ]);
  const availabilityAr = availabilityRaw || 'متوفر';
  const availabilityEn =
    availabilityAr.includes('طلب')
      ? 'On Demand'
      : availabilityAr.includes('غير')
      ? 'Out of Stock'
      : 'Available';

  const price = getColumnValue(row, [
    'السعر',
    'ملحوظة السعر',
    'price',
  ]) || 'حسب الكمية والمواصفات';

  const featuredRaw = getColumnValue(row, [
    'مميز',
    'منتج مميز',
    'featured',
  ]).toLowerCase();
  const featured =
    featuredRaw === 'نعم' ||
    featuredRaw === 'مميز' ||
    featuredRaw === 'true' ||
    featuredRaw === 'yes' ||
    featuredRaw === '1';

  const imagesRaw = getColumnValue(row, [
    'الصور',
    'روابط الصور',
    'صورة',
    'رابط الصورة',
    'images',
    'image',
    'image_url',
  ]);
  const images = imagesRaw
    ? imagesRaw
        .split(/[,،|\n]+/)
        .map(s => s.trim())
        .filter(Boolean)
    : ['/images/luxury-cotton-fabric.png'];

  const featuresRaw = getColumnValue(row, [
    'المميزات',
    'مميزات الموديل',
    'الخصائص',
    'features',
  ]);
  const featuresList = featuresRaw
    ? featuresRaw
        .split(/[,،|\n]+/)
        .map(s => s.trim())
        .filter(Boolean)
    : [];

  const specsRaw = getColumnValue(row, [
    'المواصفات الفنية',
    'المواصفات',
    'specifications',
    'specs',
  ]);
  const specsObj: Record<string, string> = {};
  if (specsRaw) {
    const pairs = specsRaw.split(/[,،|\n]+/);
    for (const pair of pairs) {
      const [k, ...vParts] = pair.split(':');
      if (k && vParts.length > 0) {
        specsObj[k.trim()] = vParts.join(':').trim();
      }
    }
  }

  // Also check individual spec columns if user added columns like "الخامة", "الوزن", "العرض"
  const material = getColumnValue(row, ['الخامة', 'المادة', 'material']);
  const weight = getColumnValue(row, ['الوزن', 'weight']);
  const width = getColumnValue(row, ['العرض', 'width']);
  if (material && !specsObj['المادة']) specsObj['المادة'] = material;
  if (weight && !specsObj['الوزن']) specsObj['الوزن'] = weight;
  if (width && !specsObj['العرض']) specsObj['العرض'] = width;

  return {
    name: {
      ar: nameAr || nameEn,
      en: nameEn || nameAr,
    },
    description: {
      ar: descAr || longDescAr || '',
      en: descEn || descAr || longDescAr || '',
    },
    longDescription: {
      ar: longDescAr || descAr || '',
      en: longDescEn || longDescAr || descEn || descAr || '',
    },
    category: {
      ar: cat.ar,
      en: cat.en,
    },
    categoryId: cat.id,
    availability: {
      ar: availabilityAr,
      en: availabilityEn,
    },
    price,
    featured,
    images,
    features: {
      ar: featuresList,
      en: featuresList,
    },
    specifications: {
      ar: specsObj,
      en: specsObj,
    },
  };
}

function extractGoogleSheetCsvUrl(url: string): string {
  const trimmed = url.trim();
  // Match Google Sheets ID
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    // Check if gid is specified
    const gidMatch = trimmed.match(/[#&?]gid=([0-9]+)/);
    const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
    return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
  }
  return trimmed;
}

export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    let rawRows: Record<string, any>[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: 'يرجى اختيار ملف إكسل أو CSV' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
    } else {
      const body = await req.json();

      if (body.googleSheetUrl) {
        const csvUrl = extractGoogleSheetCsvUrl(body.googleSheetUrl);
        const response = await fetch(csvUrl, { cache: 'no-store' });
        if (!response.ok) {
          return NextResponse.json(
            {
              success: false,
              error: 'تعذر قراءة ملف Google Sheet. تأكد من أن صلاحية الرابط "أي شخص لديه الرابط يمكنه العرض" (Anyone with the link can view).',
            },
            { status: 400 }
          );
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array', codepage: 65001 });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      } else if (Array.isArray(body.products)) {
        // Direct structured products or raw rows from client preview
        const parsedProducts: Partial<ProductItem>[] = body.products
          .map((item: any) => {
            if (item.name && typeof item.name === 'object') {
              return item as Partial<ProductItem>;
            }
            return parseRowToProduct(item);
          })
          .filter(Boolean) as Partial<ProductItem>[];

        if (parsedProducts.length === 0) {
          return NextResponse.json(
            { success: false, error: 'لم يتم العثور على منتجات صالحة للاستيراد' },
            { status: 400 }
          );
        }

        if (body.previewOnly) {
          return NextResponse.json({
            success: true,
            preview: parsedProducts,
            count: parsedProducts.length,
          });
        }

        const result = await bulkImportProducts(parsedProducts);
        revalidatePath('/', 'layout');
        return NextResponse.json({
          success: true,
          addedCount: result.addedCount,
          updatedCount: result.updatedCount,
          products: result.products,
        });
      }
    }

    const parsedProducts = rawRows
      .map(row => parseRowToProduct(row))
      .filter(Boolean) as Partial<ProductItem>[];

    if (parsedProducts.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'لم يتم العثور على موديلات داخل الملف. تأكد من وجود عمود "اسم الموديل" و"الوصف".',
        },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    if (url.searchParams.get('preview') === 'true') {
      return NextResponse.json({
        success: true,
        preview: parsedProducts,
        count: parsedProducts.length,
      });
    }

    const result = await bulkImportProducts(parsedProducts);
    revalidatePath('/', 'layout');
    return NextResponse.json({
      success: true,
      addedCount: result.addedCount,
      updatedCount: result.updatedCount,
      products: result.products,
    });
  } catch (error: any) {
    console.error('Error in bulk import:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'حدث خطأ أثناء استيراد البيانات' },
      { status: 500 }
    );
  }
}
