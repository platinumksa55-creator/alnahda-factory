import { NextRequest, NextResponse } from 'next/server';
import { getRawProducts } from '@/lib/products-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const isTemplate = searchParams.get('template') === 'true';

    let rows: Record<string, any>[] = [];

    if (isTemplate) {
      rows = [
        {
          'اسم الموديل (عربي)': 'قماش قطن مصري تمثال 100%',
          'اسم الموديل (إنجليزي)': '100% Egyptian Cotton Fabric',
          'الوصف المختصر (عربي)': 'قماش قطن طبيعي ناعم عالي الجودة مثالي للمفروشات والملابس.',
          'الوصف المختصر (إنجليزي)': 'High quality soft natural cotton fabric ideal for bedding and apparel.',
          'التعريف الكامل (عربي)': 'يتميز هذا الموديل بنعومته الفائقة ومتانته العالية مع ثبات الألوان بعد الغسيل المتكرر، مما يجعله الخيار الأول للفنادق والمنازل الراقية.',
          'التصنيف': 'أقمشة القطن',
          'حالة التوفر': 'متوفر',
          'السعر': 'حسب الكمية والمواصفات',
          'مميز': 'نعم',
          'المميزات': 'قطن طبيعي 100%، ثبات الألوان، مقاوم للانكماش',
          'المواصفات الفنية': 'المادة: 100% قطن مصري، الوزن: 200 جم/م2، العرض: 160 سم',
          'روابط الصور': '/images/luxury-cotton-fabric.png',
        },
        {
          'اسم الموديل (عربي)': 'منسوجات كتان طبيعي فاخر',
          'اسم الموديل (إنجليزي)': 'Premium Natural Linen Textile',
          'الوصف المختصر (عربي)': 'كتان طبيعي بملمس عصري وتهوية ممتازة يناسب الصيف والديكور.',
          'الوصف المختصر (إنجليزي)': 'Natural linen with modern texture and breathability suitable for summer and decor.',
          'التعريف الكامل (عربي)': 'منسوجات كتان مصنعة بأحدث ماكينات النسيج لضمان خلوها من العيوب مع ملمس طبيعي مريح وراقي.',
          'التصنيف': 'منسوجات الكتان',
          'حالة التوفر': 'متوفر',
          'السعر': 'حسب الكمية',
          'مميز': 'لا',
          'المميزات': 'تهوية عالية، ملمس طبيعي، صديق للبيئة',
          'المواصفات الفنية': 'المادة: 100% كتان، الوزن: 175 جم/م2، العرض: 150 سم',
          'روابط الصور': '/images/linen-fabric-texture.png',
        },
      ];
    } else {
      const products = getRawProducts();
      rows = products.map(p => ({
        'رقم الموديل (ID)': p.id,
        'اسم الموديل (عربي)': p.name?.ar || '',
        'اسم الموديل (إنجليزي)': p.name?.en || '',
        'الوصف المختصر (عربي)': p.description?.ar || '',
        'الوصف المختصر (إنجليزي)': p.description?.en || '',
        'التعريف الكامل (عربي)': p.longDescription?.ar || '',
        'التعريف الكامل (إنجليزي)': p.longDescription?.en || '',
        'التصنيف': p.category?.ar || 'أقمشة القطن',
        'حالة التوفر': p.availability?.ar || 'متوفر',
        'السعر': p.price || '',
        'مميز': p.featured ? 'نعم' : 'لا',
        'المميزات': (p.features?.ar || []).join('، '),
        'المواصفات الفنية': Object.entries(p.specifications?.ar || {})
          .map(([k, v]) => `${k}: ${v}`)
          .join('، '),
        'روابط الصور': (p.images || []).join(', '),
      }));
    }

    const worksheet = XLSX.utils.json_to_sheet(rows);
    // Set RTL view and column widths for better readability in Excel
    worksheet['!cols'] = [
      { wch: 28 },
      { wch: 28 },
      { wch: 45 },
      { wch: 40 },
      { wch: 55 },
      { wch: 18 },
      { wch: 15 },
      { wch: 22 },
      { wch: 10 },
      { wch: 35 },
      { wch: 40 },
      { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      isTemplate ? 'نموذج إضافة الموديلات' : 'موديلات المصنع'
    );

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const filename = isTemplate
      ? 'alnahda-products-template.xlsx'
      : `alnahda-products-export-${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting excel:', error);
    return NextResponse.json({ success: false, error: 'فشل تصدير ملف الإكسل' }, { status: 500 });
  }
}
