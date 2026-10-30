import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getRawProducts, createOrUpdateProduct } from '@/lib/products-store';
import { isAuthenticatedRequest } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    const products = getRawProducts();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticatedRequest(req)) {
    return NextResponse.json({ success: false, error: 'غير مصرح لك بتنفيذ هذه العملية' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.name?.ar && !body.name?.en) {
      return NextResponse.json({ success: false, error: 'اسم الموديل مطلوب' }, { status: 400 });
    }

    const created = createOrUpdateProduct(body);
    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, product: created });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
